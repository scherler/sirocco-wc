# Publishing Scripts

## Two-Phase Publishing Workflow

sirocco-wc uses a safe two-phase publishing workflow to prevent broken releases:

1. **Snapshot** - Publish test version with `-snap` suffix
2. **Test** - Verify the snapshot works in real projects
3. **Finalize** - Publish the official release

This ensures the exact version that will be published is tested first.

## Phase 1: Publish Snapshot

```bash
yarn publish:snapshot
```

### What it does:

1. Checks git status (must be clean)
2. Prompts for version bump type (patch/minor/major)
3. Calculates snapshot version (e.g., `1.1.25` → `1.1.26-snap`)
4. Verifies npm authentication
5. Temporarily updates `package.json` to snapshot version
6. Publishes to npm with `snapshot` tag
7. Restores `package.json` to original version
8. Displays testing instructions

### Key features:

- **No git commits** - Snapshot doesn't modify your repository
- **Safe rollback** - If publishing fails, `package.json` is automatically restored
- **Isolated tag** - Published with `snapshot` tag, won't affect `latest`

### Example output:

```
══════════════════════════════════════════════════════════════════
  📦 Snapshot Publishing - Phase 1
══════════════════════════════════════════════════════════════════

▶ Pre-flight checks
──────────────────────────────────────────────────────────────────
  ✓ Git status clean
  ✓ On branch main

▶ Version selection
──────────────────────────────────────────────────────────────────
  Current version: 1.1.25

  Available bump types:
    1) patch → 1.1.26-snap
    2) minor → 1.2.0-snap
    3) major → 2.0.0-snap

  Select version type [patch/minor/major] (patch): patch
  📸 Snapshot version: 1.1.26-snap

  Proceed with snapshot publishing? (y/N): y

▶ NPM authentication
──────────────────────────────────────────────────────────────────
  ✓ Authenticated

▶ Version update
──────────────────────────────────────────────────────────────────
  ✓ Updated package.json to 1.1.26-snap

▶ Publishing to npm
──────────────────────────────────────────────────────────────────
  Publishing snapshot...
  ✓ Publishing snapshot

  ✓ Restored package.json to 1.1.25

══════════════════════════════════════════════════════════════════
  ✅ Snapshot Published Successfully!
══════════════════════════════════════════════════════════════════

Next steps:

1. Test the snapshot in a project:
   npm install -g sirocco-wc@snapshot
   # or
   npm install --save-dev sirocco-wc@1.1.26-snap

2. Verify functionality:
   - Run your tests
   - Check core functionality
   - Ensure nothing is broken

3. When satisfied, publish final release:
   yarn publish:finalize

4. Or if issues found:
   - Fix the issues
   - Commit fixes
   - Republish snapshot: yarn publish:snapshot
```

## Phase 2: Test the Snapshot

After publishing the snapshot, test it thoroughly:

### Global installation

```bash
npm install -g sirocco-wc@snapshot
```

### Project-specific installation

```bash
npm install sirocco-wc@1.1.26-snap
# or
npm install sirocco-wc@snapshot
```

### Testing checklist

- ✅ Core commands work (`sirocco-wc init`, `sirocco-wc add`, etc.)
- ✅ Component generation works correctly
- ✅ CSS building and watching functions
- ✅ No regressions in existing functionality
- ✅ Run test suite if available

### If issues are found

1. Fix the issues in your codebase
2. Commit the fixes
3. Republish snapshot: `yarn publish:snapshot`
4. Repeat testing

## Phase 3: Publish Final Release

Once testing is complete and you're satisfied:

```bash
yarn publish:finalize
```

### What it does:

1. Checks git status (must be clean)
2. Verifies a snapshot was published
3. Shows the final version to be released
4. Auto-generates release notes from git commits
5. Allows customization of release notes
6. Bumps version with `npm version` (creates git commit & tag)
7. Pushes commit and tags to GitHub
8. Publishes to npm (as `latest` tag)
9. Creates GitHub release (if `gh` CLI is available)

### Release notes generation

The script automatically categorizes commits by type:

- **✨ New Features** - Commits starting with `feat:` or `feature:`
- **🐛 Bug Fixes** - Commits starting with `fix:`
- **📚 Documentation** - Commits starting with `docs:` or `doc:`
- **Changes** - Other commits

You can accept the generated notes or write custom ones.

### Example output:

```
══════════════════════════════════════════════════════════════════
  🚀 Final Release Publishing - Phase 2
══════════════════════════════════════════════════════════════════

▶ Pre-flight checks
──────────────────────────────────────────────────────────────────
  ✓ Git status clean
  ✓ On branch main

▶ Snapshot verification
──────────────────────────────────────────────────────────────────
  ✓ Found snapshot: 1.1.26-snap

▶ Final version
──────────────────────────────────────────────────────────────────
  Current: 1.1.25
  Release: 1.1.26

  Proceed with final release? (y/N): y

▶ Release notes
──────────────────────────────────────────────────────────────────

## Release 1.1.26

### ✨ New Features

- Add automated publishing helper script

### 🐛 Bug Fixes

- Upgrade Yarn to 4.10.3 to resolve ExperimentalWarning

  Use these release notes? (Y/n): y

▶ Git operations
──────────────────────────────────────────────────────────────────
  Version bump...
  ✓ Version bump

  Push commit...
  ✓ Push commit

  Push tags...
  ✓ Push tags

▶ Publishing to npm
──────────────────────────────────────────────────────────────────
  Publishing release...
  ✓ Publishing release

▶ GitHub release
──────────────────────────────────────────────────────────────────
  Creating GitHub release...
  ✓ Creating GitHub release

══════════════════════════════════════════════════════════════════
  ✅ Release Published Successfully!
══════════════════════════════════════════════════════════════════

Version 1.1.26 is now live on npm.
```

## Prerequisites

### Required

- Clean git working directory
- npm authentication (`npm login`)
- Push access to GitHub repository

### Optional

- [GitHub CLI](https://cli.github.com/) (`gh`) for automatic GitHub release creation

To install GitHub CLI:

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

## Version Types

- **patch** (X.X.1): Bug fixes, no new features
- **minor** (X.1.0): New features, backward compatible
- **major** (1.0.0): Breaking changes, not backward compatible

## Troubleshooting

### "You have uncommitted changes"

Commit or stash your changes before publishing:

```bash
git status
git add .
git commit -m "Prepare for release"
```

### "Not logged in to npm"

Log in to npm:

```bash
npm login
```

### "No snapshot found"

The finalize command expects a snapshot to exist. Either:
1. Run `yarn publish:snapshot` first (recommended)
2. Or confirm to proceed without snapshot testing

### Publishing failed

If publishing fails:
- Check npm credentials
- Verify network connection
- Ensure package name is not taken
- Check npm registry status

For snapshots, the `package.json` is automatically restored on failure.

## Manual Publishing (Not Recommended)

If you need to publish manually without this script:

```bash
# Version bump
npm version patch  # or minor, or major

# Push
git push origin main
git push origin --tags

# Publish
npm publish

# Create GitHub release manually at:
# https://github.com/scherler/sirocco-wc/releases/new
```

However, we **strongly recommend** using the two-phase workflow for safety.
