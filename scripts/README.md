# Publishing Scripts

## publish.js

Automated Node.js helper script for publishing new versions of sirocco-wc.

### What it does

This script automates the entire publishing workflow:

1. **Pre-flight checks**: Verifies git status and branch
2. **Version selection**: Interactive prompt for version type (patch/minor/major)
3. **Release notes generation**: Auto-generates draft from git commits (can be customized)
4. **Version bump**: Updates package.json and creates git commit
5. **Git operations**: Pushes changes and tags to GitHub
6. **GitHub release**: Creates release (if `gh` CLI is installed) or provides manual instructions
7. **Automated publishing**: GitHub Actions workflow automatically publishes to npm

### Release Notes Feature

The script automatically generates release notes by analyzing commits since the last version:

- **Categorizes commits** by type (Features, Bug Fixes, Documentation, Other)
- **Follows conventional commits** format (feat:, fix:, docs:)
- **Provides a draft** that you can accept (press Enter), edit, or replace
- **Smart defaults** if no commits are found

Example generated draft:
```
Release 1.2.0

## ✨ Features

- Add automated publishing helper script
- New component theming system

## 🐛 Bug Fixes

- Fix build issues with Parcel

## 📚 Documentation

- Add comprehensive theming documentation
```

### Usage

```bash
yarn publish:release
```

Or directly:

```bash
node scripts/publish.js
```

### Prerequisites

- Clean git working directory (no uncommitted changes)
- Authenticated git push access to the repository
- *(Optional)* GitHub CLI (`gh`) for automatic release creation

### Installation of GitHub CLI (optional but recommended)

```bash
# macOS
brew install gh

# Linux/WSL
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# Authenticate
gh auth login
```

### Workflow

1. Run `yarn publish:release`
2. Script shows current version and calculates new versions for each bump type
3. Select version type: `patch` (1.1.25 → 1.1.26), `minor` (1.1.25 → 1.2.0), or `major` (1.1.25 → 2.0.0)
4. Confirm the version bump
5. Enter release notes describing changes
6. Script performs version bump, commits, and pushes
7. If `gh` CLI is installed: GitHub release is created automatically
8. If `gh` CLI is not installed: Manual link provided to create release
9. GitHub Actions workflow automatically publishes to npm registry

### Version Types

- **patch** (1.1.x): Bug fixes, minor changes, no new features
- **minor** (1.x.0): New features, backward compatible
- **major** (x.0.0): Breaking changes, not backward compatible

### Troubleshooting

**Error: "You have uncommitted changes"**
- Commit or stash your changes before publishing
- Run `git status` to see what needs to be committed

**Error: "Could not create GitHub release"**
- The script provides a direct link to manually create the release
- Go to the provided URL and fill in the release details

**Release created but not published to npm**
- Check GitHub Actions workflow: https://github.com/scherler/sirocco-wc/actions
- Ensure `NPM_TOKEN` secret is configured in repository settings
- Workflow runs automatically when a GitHub release is created

### Manual Publishing

If you prefer not to use this script, you can publish manually:

```bash
# Bump version
npm version patch  # or minor, or major

# Push to git
git push origin main
git push origin --tags

# Create GitHub release at:
# https://github.com/scherler/sirocco-wc/releases/new

# Or publish directly to npm
npm publish
```
