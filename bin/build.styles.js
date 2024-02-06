const glob = require("glob");
const path = require('path');

const { sourceCss, srcDir, config} = require("./config");

const { buildCss, buildTailwindBaseCss } = require("./build.css.js");

module.exports = (logger) => {
  const styleFiles = glob.sync(sourceCss.replace(/\\/g, "/"));
  logger.info(`Found ${styleFiles.length} style files`);

  // maybe you want to throw an error if no style files were found for that package
  if (!styleFiles.length) {
    throw new Error(sourceCss, "why you no provide files?");
  }
  buildTailwindBaseCss(srcDir, config, logger);
  styleFiles.forEach((filePath) => {
    buildCss(filePath, srcDir, config, logger);
  });
};
