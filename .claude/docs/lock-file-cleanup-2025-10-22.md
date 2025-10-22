# Lock File Cleanup

**Date**: 2025-10-22
**Issue**: Dual lock files (package-lock.json + yarn.lock)
**Resolution**: Removed package-lock.json, keeping only yarn.lock

## Problem

The repository had both `package-lock.json` (npm) and `yarn.lock` (Yarn) present, which is problematic because:

1. **Conflicting dependency resolution**: npm and Yarn use different resolution algorithms
2. **Confusion for contributors**: Which package manager should be used?
3. **CI/CD issues**: Build systems might use wrong package manager
4. **Version drift**: Two lock files can get out of sync

## Project Configuration

The project is configured to use **Yarn Berry (v3.2.4)**:

**package.json**:
```json
{
  "packageManager": "yarn@3.2.4"
}
```

**.yarnrc.yml**:
```yaml
nodeLinker: pnp
yarnPath: .yarn/releases/yarn-3.2.4.cjs
```

**.gitignore** (already correct):
```
# package-lock.json
```

## Why Yarn?

1. **Yarn Berry (v3)** with Plug'n'Play for faster installs
2. **Plugins**: Interactive tools, TypeScript support
3. **Template compatibility**: The sirocco-wc template uses Yarn
4. **Consistent with generated projects**: All scaffolded projects use Yarn

## Resolution

1. **Removed** `package-lock.json` from repository
2. **Kept** `yarn.lock` (updated to latest dependencies)
3. **Verified** `.gitignore` already excludes `package-lock.json`

## How This Happened

Likely scenarios:
- Developer ran `npm install` instead of `yarn install`
- IDE auto-installed with npm
- CI/CD system used npm as fallback

## Prevention

**For Developers**:
```bash
# Always use yarn
yarn install
yarn add <package>
yarn remove <package>

# NOT npm
# npm install  ❌
# npm i <package>  ❌
```

**package.json enforces this**:
```json
{
  "engines": {
    "npm": "please-use-yarn"
  }
}
```

**Verify package manager**:
```bash
# Check which is configured
cat package.json | grep packageManager

# Output: "packageManager": "yarn@3.2.4"
```

## Security Note

GitHub detected 38 vulnerabilities in dependencies:
- 3 critical
- 17 high
- 12 moderate
- 6 low

**Action Required**: See `.claude/tasks/` for dependency update task (from ENHANCEMENTS.md #24).

## Related Documents

- `.claude/analysis/ENHANCEMENTS.md` - Item #24: Update Dependencies
- `package.json` - packageManager configuration
- `.yarnrc.yml` - Yarn Berry configuration

---

**Resolution Status**: ✅ Complete
**Next Steps**: Update vulnerable dependencies (see security alert)
