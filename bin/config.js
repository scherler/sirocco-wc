const path = require('path');
const fs = require('fs')
const localPath = process.cwd();
const defaultComponentType = process.env.SWC_TYPE || 'components';
const prefix = process.env.SWC_PREFIX || 'swc-';
const index = process.env.SWC_INDEX || 'index.ts';
const srcDir = process.env.SWC_SRC || `src/main/ts`
const destDir = process.env.SWC_DEST || 'dist'
const cssDir = process.env.SWC_CSS || `${srcDir}/**/*.css`
const source = path.join(localPath, srcDir);
const sourceCss = path.join(localPath, cssDir);
const sversion = require('../package.json').version
const sname = require('../package.json').name
const themeCssFile = path.join(localPath, 'theme.css');
const themeCssPath = fs.existsSync(themeCssFile) ? themeCssFile : null;

if (!themeCssPath && fs.existsSync(path.join(localPath, 'tailwind.config.js')))
  console.warn('[sirocco-wc] Found tailwind.config.js but no theme.css — Tailwind v4 has no automatic JS-config bridge; custom theme() extensions will NOT be applied to per-component builds. Migrate to a CSS-native theme.css (@theme {...}).')

module.exports = {
    defaultComponentType,
    cssDir,
    prefix,
    srcDir,
    destDir,
    source,
    sourceCss,
    index,
    localPath,
    sname,
    sversion,
    themeCssPath,
}
