#!/usr/bin/env node

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

async function promptReleaseNotes() {
  log('\n📝 Enter release notes (press Enter twice to finish):', colors.blue);
  log('Tip: Describe what changed in this version\n', colors.yellow);

  const schema = {
    properties: {
      notes: {
        description: 'Release notes',
        type: 'string',
        required: true,
        message: 'Release notes are required',
      },
    },
  };

  const result = await prompt.get(schema);
  return result.notes;
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
    const releaseNotes = await promptReleaseNotes();

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
