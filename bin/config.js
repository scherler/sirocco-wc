const path = require('path');
const fs = require('fs')
// configuration
const localPath = process.cwd();
const defaultComponentType = process.env.SWC_TYPE || 'components';
const prefix = process.env.SWC_PREFIX || 'swc-';
const index = process.env.SWC_INDEX || 'index.ts';
const srcDir = process.env.SWC_SRC || `src/main/ts`
const destDir = process.env.SWC_DEST || 'dist'
const cssDir = process.env.SWC_CSS || `${srcDir}\/\*\*\/\*.css`
const source = path.join(localPath, srcDir);
const sourceCss = path.join(localPath, cssDir);
const sversion = require('../package.json').version
const sname = require('../package.json').name
const localConfig = path.join(localPath, 'tailwind.config.js');
const mimimalConfig = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}

const config = fs.existsSync(localConfig) ? require(localConfig) : mimimalConfig;

// exports
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
    config,
}
