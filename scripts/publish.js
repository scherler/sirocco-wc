#!/usr/bin/env node

/**
 * Publishing helper script for sirocco-wc
 * Two-phase publishing: snapshot first, then final release after testing
 */

const { execSync } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');
const readline = require('readline');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function header(title) {
  log('\n' + '═'.repeat(70), colors.bright);
  log(`  ${title}`, colors.bright);
  log('═'.repeat(70) + '\n', colors.bright);
}

function section(title) {
  log(`\n▶ ${title}`, colors.cyan);
  log('─'.repeat(70), colors.dim);
}

function execCommand(command, description, silent = false) {
  try {
    if (!silent) log(`  ${description}...`, colors.blue);
    const result = execSync(command, { encoding: 'utf-8', stdio: silent ? ['pipe', 'pipe', 'pipe'] : ['pipe', 'pipe', 'inherit'] });
    if (!silent) log(`  ✓ ${description}`, colors.green);
    return result.trim();
  } catch (error) {
    log(`  ✗ ${description} failed`, colors.red);
    if (!silent) console.error(error.stderr || error.message);
    throw error;
  }
}

function getCurrentVersion() {
  const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));
  return packageJson.version;
}

function updatePackageVersion(version) {
  const packagePath = './package.json';
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
  packageJson.version = version;
  writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
}

function checkGitStatus() {
  const status = execSync('git status --porcelain', { encoding: 'utf-8' });
  if (status.trim()) {
    log('⚠ Warning: You have uncommitted changes:', colors.yellow);
    console.log(status);
    log('\nPlease commit or stash your changes before publishing.', colors.yellow);
    process.exit(1);
  }
}

function checkGitBranch() {
  const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
  if (branch !== 'main') {
    log(`⚠ Warning: You are on branch '${branch}', not 'main'`, colors.yellow);
  }
  return branch;
}

function calculateNewVersion(current, type) {
  const parts = current.replace(/-snap$/, '').split('.');
  const [major, minor, patch] = parts.map(Number);

  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error(`Invalid version type: ${type}`);
  }
}

function generateReleaseNotes(currentVersion, newVersion) {
  try {
    let commits;
    try {
      // Try to get commits since last version tag
      commits = execSync(
        `git log v${currentVersion}..HEAD --oneline --no-merges --pretty=format:"%s"`,
        { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }
      ).trim();
    } catch {
      // Fallback to recent commits
      commits = execSync(
        'git log --oneline --no-merges -10 --pretty=format:"%s"',
        { encoding: 'utf-8' }
      ).trim();
    }

    if (!commits) {
      return `## Release ${newVersion}\n\nUpdates and improvements.`;
    }

    const commitLines = commits.split('\n').filter(line => line.trim());
    const features = [];
    const fixes = [];
    const docs = [];
    const other = [];

    commitLines.forEach(commit => {
      const lower = commit.toLowerCase();
      if (lower.startsWith('feat:') || lower.startsWith('feature:')) {
        features.push(commit.replace(/^feat(ure)?:\s*/i, ''));
      } else if (lower.startsWith('fix:')) {
        fixes.push(commit.replace(/^fix:\s*/i, ''));
      } else if (lower.startsWith('docs:') || lower.startsWith('doc:')) {
        docs.push(commit.replace(/^docs?:\s*/i, ''));
      } else {
        other.push(commit);
      }
    });

    let notes = `## Release ${newVersion}\n\n`;

    if (features.length > 0) {
      notes += '### ✨ New Features\n\n';
      features.forEach(f => notes += `- ${f}\n`);
      notes += '\n';
    }

    if (fixes.length > 0) {
      notes += '### 🐛 Bug Fixes\n\n';
      fixes.forEach(f => notes += `- ${f}\n`);
      notes += '\n';
    }

    if (docs.length > 0) {
      notes += '### 📚 Documentation\n\n';
      docs.forEach(d => notes += `- ${d}\n`);
      notes += '\n';
    }

    if (other.length > 0 && (features.length === 0 && fixes.length === 0)) {
      notes += '### Changes\n\n';
      other.slice(0, 5).forEach(o => notes += `- ${o}\n`);
    }

    return notes.trim();
  } catch {
    return `## Release ${newVersion}\n\nUpdates and improvements.`;
  }
}

async function prompt(question, defaultValue = '') {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    const displayDefault = defaultValue ? ` (${defaultValue})` : '';
    rl.question(`${question}${displayDefault}: `, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue);
    });
  });
}

async function confirm(question, defaultYes = false) {
  const defaultText = defaultYes ? 'Y/n' : 'y/N';
  const answer = await prompt(`${question} (${defaultText})`);
  const normalized = answer.toLowerCase();

  if (!normalized) return defaultYes;
  return normalized === 'y' || normalized === 'yes';
}

function checkNpmAuth() {
  try {
    execSync('npm whoami', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function checkGhCli() {
  try {
    execSync('gh --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function checkVersionExists(packageName, version) {
  try {
    execSync(`npm view ${packageName}@${version} version`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
    return true;
  } catch {
    return false;
  }
}

function findNextAvailableSnapshot(packageName, baseVersion) {
  const baseSnapshotVersion = `${baseVersion}-snap`;

  // Check if base version exists
  if (!checkVersionExists(packageName, baseSnapshotVersion)) {
    return baseSnapshotVersion;
  }

  // Try .1, .2, .3, etc.
  let revision = 1;
  while (revision < 100) { // Safety limit
    const versionWithRevision = `${baseSnapshotVersion}.${revision}`;
    if (!checkVersionExists(packageName, versionWithRevision)) {
      return versionWithRevision;
    }
    revision++;
  }

  throw new Error('Could not find available snapshot version (tried up to .99)');
}

async function publishSnapshot(otpFlag = '') {
  header('📦 Snapshot Publishing - Phase 1');

  // Pre-flight checks
  section('Pre-flight checks');
  checkGitStatus();
  const branch = checkGitBranch();
  const currentVersion = getCurrentVersion();

  if (currentVersion.endsWith('-snap')) {
    log('  ⚠ Current version already is a snapshot', colors.yellow);
    const proceed = await confirm('  Continue anyway?', false);
    if (!proceed) {
      log('\n✗ Cancelled', colors.yellow);
      process.exit(0);
    }
  }

  // Version selection
  section('Version selection');
  log(`  Current version: ${currentVersion}`, colors.bright);
  log(`\n  Available bump types:`);
  log(`    1) patch → ${calculateNewVersion(currentVersion, 'patch')}-snap`, colors.dim);
  log(`    2) minor → ${calculateNewVersion(currentVersion, 'minor')}-snap`, colors.dim);
  log(`    3) major → ${calculateNewVersion(currentVersion, 'major')}-snap`, colors.dim);

  const versionType = await prompt('\n  Select version type [patch/minor/major]', 'patch');

  if (!['patch', 'minor', 'major'].includes(versionType)) {
    log('\n✗ Invalid version type', colors.red);
    process.exit(1);
  }

  const newVersion = calculateNewVersion(currentVersion, versionType);

  // Find next available snapshot version
  section('Checking npm registry');
  const snapshotVersion = findNextAvailableSnapshot('sirocco-wc', newVersion);

  if (snapshotVersion !== `${newVersion}-snap`) {
    log(`  ℹ Version ${newVersion}-snap already exists on npm`, colors.yellow);
    log(`  → Using next available: ${snapshotVersion}`, colors.cyan);
  } else {
    log(`  ✓ Version ${snapshotVersion} is available`, colors.green);
  }

  log(`\n  📸 Snapshot version: ${snapshotVersion}`, colors.bright);

  const confirmPublish = await confirm('\n  Proceed with snapshot publishing?', false);
  if (!confirmPublish) {
    log('\n✗ Cancelled', colors.yellow);
    process.exit(0);
  }

  // Check npm authentication
  section('NPM authentication');
  if (!checkNpmAuth()) {
    log('  ✗ Not logged in to npm', colors.red);
    log('  Run: npm login', colors.yellow);
    process.exit(1);
  }
  log('  ✓ Authenticated', colors.green);

  // Update version in package.json
  section('Version update');
  updatePackageVersion(snapshotVersion);
  log(`  ✓ Updated package.json to ${snapshotVersion}`, colors.green);

  // Publish to npm with snapshot tag
  section('Publishing to npm');
  try {
    const publishCmd = `npm publish --tag snapshot${otpFlag ? ' ' + otpFlag : ''}`;
    execCommand(publishCmd, 'Publishing snapshot');
  } catch (error) {
    // Restore version on failure
    updatePackageVersion(currentVersion);
    log('  ✗ Publishing failed, version restored', colors.red);
    process.exit(1);
  }

  // Restore version (snapshot published but not committed)
  updatePackageVersion(currentVersion);
  log(`  ✓ Restored package.json to ${currentVersion}`, colors.green);

  // Success instructions
  header('✅ Snapshot Published Successfully!');

  log('Next steps:', colors.bright);
  log('');
  log('1. Test the snapshot in a project:', colors.cyan);
  log(`   npm install -g sirocco-wc@snapshot`, colors.dim);
  log(`   # or`);
  log(`   npm install --save-dev sirocco-wc@${snapshotVersion}`, colors.dim);
  log('');
  log('2. Verify functionality:', colors.cyan);
  log('   - Run your tests', colors.dim);
  log('   - Check core functionality', colors.dim);
  log('   - Ensure nothing is broken', colors.dim);
  log('');
  log('3. When satisfied, publish final release:', colors.cyan);
  log('   yarn publish:finalize', colors.dim);
  log('');
  log('4. Or if issues found:', colors.cyan);
  log('   - Fix the issues', colors.dim);
  log('   - Commit fixes', colors.dim);
  log('   - Republish snapshot: yarn publish:snapshot', colors.dim);
  log('');
}

async function publishFinal(otpFlag = '') {
  header('🚀 Final Release Publishing - Phase 2');

  // Pre-flight checks
  section('Pre-flight checks');
  checkGitStatus();
  const branch = checkGitBranch();
  const currentVersion = getCurrentVersion();

  // Check if snapshot exists
  section('Snapshot verification');
  const baseVersion = currentVersion.replace(/-snap$/, '');
  let snapshotVersion;

  try {
    const npmView = execSync(`npm view sirocco-wc@snapshot version`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
    snapshotVersion = npmView;

    if (snapshotVersion && snapshotVersion.startsWith(baseVersion)) {
      log(`  ✓ Found snapshot: ${snapshotVersion}`, colors.green);
    } else {
      log(`  ⚠ No matching snapshot found (found: ${snapshotVersion || 'none'})`, colors.yellow);
      const proceed = await confirm('  Continue anyway?', false);
      if (!proceed) {
        log('\n✗ Cancelled', colors.yellow);
        log('\n  Tip: Run "yarn publish:snapshot" first', colors.dim);
        process.exit(0);
      }
    }
  } catch {
    log('  ⚠ No snapshot found on npm', colors.yellow);
    const proceed = await confirm('  Continue without testing a snapshot?', false);
    if (!proceed) {
      log('\n✗ Cancelled', colors.yellow);
      log('\n  Tip: Run "yarn publish:snapshot" first', colors.dim);
      process.exit(0);
    }
  }

  // Determine version
  const versionMatch = snapshotVersion ? snapshotVersion.match(/^(\d+\.\d+\.\d+)-snap$/) : null;
  const newVersion = versionMatch ? versionMatch[1] : baseVersion;

  section('Final version');
  log(`  Current: ${currentVersion}`, colors.dim);
  log(`  Release: ${newVersion}`, colors.bright);

  const confirmRelease = await confirm('\n  Proceed with final release?', false);
  if (!confirmRelease) {
    log('\n✗ Cancelled', colors.yellow);
    process.exit(0);
  }

  // Generate release notes
  section('Release notes');
  const releaseNotes = generateReleaseNotes(currentVersion, newVersion);
  log('');
  log(releaseNotes, colors.dim);
  log('');

  const notesOk = await confirm('  Use these release notes?', true);
  let finalNotes = releaseNotes;

  if (!notesOk) {
    log('\n  Enter custom release notes (Ctrl+D when done):', colors.cyan);
    const lines = [];
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    for await (const line of rl) {
      lines.push(line);
    }

    finalNotes = lines.join('\n');
    if (!finalNotes.trim()) {
      log('  ✗ Release notes cannot be empty', colors.red);
      process.exit(1);
    }
  }

  // Version bump and commit
  section('Git operations');
  execCommand(`npm version ${newVersion} -m "Release v${newVersion}"`, 'Version bump');
  execCommand(`git push origin ${branch}`, 'Push commit');
  execCommand('git push origin --tags', 'Push tags');

  // Publish to npm
  section('Publishing to npm');
  const publishCmd = `npm publish${otpFlag ? ' ' + otpFlag : ''}`;
  execCommand(publishCmd, 'Publishing release');

  // Create GitHub release
  section('GitHub release');
  if (checkGhCli()) {
    try {
      const tag = `v${newVersion}`;
      // Write release notes to temp file to handle multiline
      const tempFile = '/tmp/release-notes.txt';
      writeFileSync(tempFile, finalNotes);
      execCommand(
        `gh release create ${tag} --title "Release ${newVersion}" --notes-file ${tempFile}`,
        'Creating GitHub release'
      );
    } catch (error) {
      log('  ⚠ Could not create GitHub release automatically', colors.yellow);
      log(`  Create manually: https://github.com/scherler/sirocco-wc/releases/new?tag=v${newVersion}`, colors.blue);
    }
  } else {
    log('  ⚠ GitHub CLI not installed', colors.yellow);
    log(`  Create release manually: https://github.com/scherler/sirocco-wc/releases/new?tag=v${newVersion}`, colors.blue);
  }

  // Success
  header('✅ Release Published Successfully!');
  log(`Version ${newVersion} is now live on npm.`, colors.green);
  log('');
}

// Main
async function main() {
  const args = process.argv.slice(2);
  const mode = args[0];

  // Extract --otp flag if present
  const otpIndex = args.findIndex(arg => arg.startsWith('--otp'));
  let otpFlag = '';

  if (otpIndex !== -1) {
    const otpArg = args[otpIndex];
    if (otpArg.includes('=')) {
      // Format: --otp=123456
      otpFlag = otpArg;
    } else if (args[otpIndex + 1]) {
      // Format: --otp 123456
      otpFlag = `--otp=${args[otpIndex + 1]}`;
    }
  }

  if (mode === 'snapshot' || mode === '--snapshot' || mode === '-s') {
    await publishSnapshot(otpFlag);
  } else if (mode === 'final' || mode === 'finalize' || mode === '--final' || mode === '-f') {
    await publishFinal(otpFlag);
  } else {
    log('Usage:', colors.bright);
    log('  yarn publish:snapshot [--otp=<code>]  - Publish test version (with -snap suffix)', colors.dim);
    log('  yarn publish:finalize [--otp=<code>]  - Publish final release after testing', colors.dim);
    log('');
    log('Workflow:', colors.cyan);
    log('  1. yarn publish:snapshot  → Test the snapshot', colors.dim);
    log('  2. yarn publish:finalize  → Publish final version', colors.dim);
    log('');
    log('OTP (Two-Factor Auth):', colors.cyan);
    log('  If you have 2FA enabled, add --otp=<code> to the command', colors.dim);
    log('  Example: yarn publish:snapshot --otp=123456', colors.dim);
    process.exit(1);
  }
}

main().catch((error) => {
  log(`\n✗ Error: ${error.message}`, colors.red);
  process.exit(1);
});
