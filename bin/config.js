const path = require('path');
// configuration
const localPath = process.cwd();
const defaultComponentType = process.env.SWC_TYPE || 'components';
const prefix = process.env.SWC_PREFIX || 'swc-';
const index = process.env.SWC_INDEX || 'index.ts';
const srcDir = process.env.SWC_SRC || `src/main/ts`
const destDir = process.env.SWC_DEST || `./src/main/webapp/js`
const cssDir = process.env.SWC_CSS || `${srcDir}\/\*\*\/\*.css`
const source = path.join(localPath, srcDir);
const sourceCss = path.join(localPath, cssDir);

// exports
module.exports = {
    defaultComponentType,
    cssDir,
    prefix,
    srcDir,
    source,
    sourceCss,
    index,
    destDir,
    localPath
}
