const glob = require("glob");

const { sourceCss, themeCssPath } = require("./config");

const buildCss = require("./build.css.js");

module.exports = async (logger) => {
  const styleFiles = glob.sync(sourceCss.replace(/\\/g, "/"));
  logger.info(`Found ${styleFiles.length} style files`);

  // A freshly-scaffolded project has no components yet — that's a valid state
  // (run `sirocco-wc add` to create the first one), not a build error.
  if (!styleFiles.length) {
    return;
  }
  await Promise.all(styleFiles.map((filePath) => buildCss(filePath, themeCssPath, logger)));
};
