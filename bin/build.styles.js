const glob = require("glob");

const { sourceCss, themeCssPath } = require("./config");

const buildCss = require("./build.css.js");

module.exports = async (logger) => {
  const styleFiles = glob.sync(sourceCss.replace(/\\/g, "/"));
  logger.info(`Found ${styleFiles.length} style files`);

  // maybe you want to throw an error if no style files were found for that package
  if (!styleFiles.length) {
    throw new Error(`${sourceCss}: no style files found`);
  }
  await Promise.all(styleFiles.map((filePath) => buildCss(filePath, themeCssPath, logger)));
};
