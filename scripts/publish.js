#!/usr/bin/env node

// Suppress experimental warning from prompt module
process.removeAllListeners('warning');
process.on('warning', (warning) => {
  if (!warning.message.includes('ExperimentalWarning')) {
    console.warn(warning);
  }
});

/**
 * Publishing helper script for sirocco-wc
 * Automates version bumping, git operations, and GitHub release creation
 */

const { execSync } = require('child_process');
const { readFileSync } = require('fs');
const prompt = require('prompt');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function execCommand(command, description) {
  try {
    log(`\n${description}...`, colors.blue);
    const result = execSync(command, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
    log(`✓ ${description} completed`, colors.green);
    return result.trim();
  } catch (error) {
    log(`✗ Error: ${error.message}`, colors.red);
    throw error;
  }
}

function getCurrentVersion() {
  const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));
  return packageJson.version;
}

function checkGitStatus() {
  const status = execSync('git status --porcelain', { encoding: 'utf-8' });
  if (status.trim()) {
    log('\n⚠ Warning: You have uncommitted changes:', colors.yellow);
    console.log(status);
    log('Please commit or stash your changes before publishing.', colors.yellow);
    process.exit(1);
  }
}

function checkGitBranch() {
  const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
  if (branch !== 'main') {
    log(`\n⚠ Warning: You are on branch '${branch}', not 'main'`, colors.yellow);
  }
  return branch;
}

function calculateNewVersion(current, type) {
  const [major, minor, patch] = current.split('.').map(Number);

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

async function promptVersionType(currentVersion) {
  log(`\n${colors.bright}Current version: ${currentVersion}${colors.reset}`, colors.bright);
  log('\nVersion bump options:');
  log(`  patch: ${calculateNewVersion(currentVersion, 'patch')} (bug fixes)`, colors.blue);
  log(`  minor: ${calculateNewVersion(currentVersion, 'minor')} (new features, backward compatible)`, colors.blue);
  log(`  major: ${calculateNewVersion(currentVersion, 'major')} (breaking changes)`, colors.blue);
  log(`  cancel: Exit without publishing`, colors.yellow);

  const schema = {
    properties: {
      type: {
        description: 'Select version type',
        type: 'string',
        pattern: /^(patch|minor|major|cancel)$/,
        message: 'Must be patch, minor, major, or cancel',
        required: true,
        default: 'patch',
      },
    },
  };

  prompt.start();
  prompt.message = '';
  prompt.delimiter = '';

  const result = await prompt.get(schema);
  return result;
}

function generateReleaseNotesDraft(currentVersion, newVersion) {
  try {
    // Get commits since last tag
    let commits;
    try {
      commits = execSync(`git log v${currentVersion}..HEAD --oneline --no-merges --pretty=format:"%s"`,
        { encoding: 'utf-8' }).trim();
    } catch {
      // If tag doesn't exist, get recent commits
      commits = execSync('git log --oneline --no-merges -10 --pretty=format:"%s"',
        { encoding: 'utf-8' }).trim();
    }

    if (!commits) {
      return `Release ${newVersion}

Updates and improvements.`;
    }

    const commitLines = commits.split('\n').filter(line => line.trim());

    // Categorize commits
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

    let draft = `Release ${newVersion}\n\n`;

    if (features.length > 0) {
      draft += '## ✨ Features\n\n';
      features.forEach(f => draft += `- ${f}\n`);
      draft += '\n';
    }

    if (fixes.length > 0) {
      draft += '## 🐛 Bug Fixes\n\n';
      fixes.forEach(f => draft += `- ${f}\n`);
      draft += '\n';
    }

    if (docs.length > 0) {
      draft += '## 📚 Documentation\n\n';
      docs.forEach(d => draft += `- ${d}\n`);
      draft += '\n';
    }

    if (other.length > 0) {
      draft += '## 🔧 Other Changes\n\n';
      other.forEach(o => draft += `- ${o}\n`);
      draft += '\n';
    }

    return draft.trim();
  } catch (error) {
    return `Release ${newVersion}

Updates and improvements.`;
  }
}

async function promptReleaseNotes(currentVersion, newVersion) {
  const draft = generateReleaseNotesDraft(currentVersion, newVersion);

  log('\n📝 Generated release notes draft:', colors.blue);
  log('━'.repeat(60), colors.bright);
  console.log(draft);
  log('━'.repeat(60), colors.bright);

  log('\nOptions:', colors.yellow);
  log('  1. Press Enter to use the draft above', colors.yellow);
  log('  2. Type your own release notes', colors.yellow);
  log('  3. Type "edit" to modify the draft\n', colors.yellow);

  const schema = {
    properties: {
      notes: {
        description: 'Release notes (press Enter to use draft)',
        type: 'string',
        required: false,
        default: draft,
      },
    },
  };

  prompt.message = '';
  prompt.delimiter = '';

  const result = await prompt.get(schema);
  const userNotes = result.notes || draft;

  if (userNotes.toLowerCase() === 'edit') {
    log('\n✏️  Enter your custom release notes:', colors.blue);
    const editSchema = {
      properties: {
        notes: {
          description: 'Custom release notes',
          type: 'string',
          required: true,
          message: 'Release notes are required',
        },
      },
    };
    const editResult = await prompt.get(editSchema);
    return editResult.notes;
  }

  return userNotes;
}

function checkGhCli() {
  try {
    execSync('gh --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function main() {
  try {
    log(`\n${'='.repeat(60)}`, colors.bright);
    log('sirocco-wc Publishing Helper', colors.bright);
    log(`${'='.repeat(60)}\n`, colors.bright);

    // Pre-flight checks
    checkGitStatus();
    const branch = checkGitBranch();
    const currentVersion = getCurrentVersion();

    // Get version type from user
    const versionChoice = await promptVersionType(currentVersion);

    if (versionChoice.type === 'cancel') {
      log('\n✗ Publishing cancelled', colors.yellow);
      process.exit(0);
    }

    const newVersion = calculateNewVersion(currentVersion, versionChoice.type);

    log(`\n📦 Preparing to publish version ${newVersion}`, colors.bright);

    // Confirm before proceeding
    const confirmSchema = {
      properties: {
        confirm: {
          description: `Proceed with ${versionChoice.type} release (${currentVersion} → ${newVersion})? (yes/no)`,
          type: 'string',
          pattern: /^(yes|no|y|n)$/i,
          message: 'Please answer yes or no',
          required: true,
          default: 'no',
        },
      },
    };

    const confirmation = await prompt.get(confirmSchema);
    if (confirmation.confirm.toLowerCase().startsWith('n')) {
      log('\n✗ Publishing cancelled', colors.yellow);
      process.exit(0);
    }

    // Get release notes
    const releaseNotes = await promptReleaseNotes(currentVersion, newVersion);

    // Execute version bump
    log('\n📝 Updating version...', colors.blue);
    execCommand(`npm version ${versionChoice.type} -m "Bump version to %s"`, 'Version bump');

    // Push changes
    execCommand(`git push origin ${branch}`, 'Push commit');
    execCommand('git push origin --tags', 'Push tags');

    const tag = `v${newVersion}`;
    log(`\n✓ Version ${newVersion} committed and pushed with tag ${tag}`, colors.green);

    // Try to create GitHub release using gh CLI
    const hasGhCli = checkGhCli();

    if (hasGhCli) {
      log('\n🚀 Creating GitHub release...', colors.blue);
      try {
        execCommand(
          `gh release create ${tag} --title "Release ${newVersion}" --notes "${releaseNotes}"`,
          'Create GitHub release'
        );
        log('\n✓ GitHub release created successfully!', colors.green);
        log('📦 GitHub Actions will automatically publish to npm', colors.blue);
      } catch (error) {
        log('\n⚠ Could not create GitHub release automatically', colors.yellow);
        log('Please create it manually:', colors.yellow);
        log(`  https://github.com/scherler/sirocco-wc/releases/new?tag=${tag}`, colors.blue);
      }
    } else {
      log('\n⚠ GitHub CLI (gh) not installed', colors.yellow);
      log('Please create the GitHub release manually:', colors.yellow);
      log(`  1. Go to: https://github.com/scherler/sirocco-wc/releases/new?tag=${tag}`, colors.blue);
      log(`  2. Select tag: ${tag}`, colors.blue);
      log(`  3. Add release notes and publish`, colors.blue);
      log('\n💡 Tip: Install GitHub CLI with: npm install -g gh', colors.yellow);
    }

    log('\n' + '='.repeat(60), colors.bright);
    log('✓ Publishing process completed!', colors.green);
    log('='.repeat(60) + '\n', colors.bright);

  } catch (error) {
    log(`\n✗ Publishing failed: ${error.message}`, colors.red);
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  log(`\n✗ Unexpected error: ${error.message}`, colors.red);
  process.exit(1);
});
