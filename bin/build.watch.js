const path = require("path");
const chokidar = require("chokidar");

const buildCss = require("./build.css.js");
const { sourceCss, localPath } = require("./config");

module.exports = (logger) => {
  chokidar
    .watch(sourceCss)
    .on("add", (file) => {
      const parsed = path.parse(file);
      const ts = `${parsed.dir}${path.sep}${parsed.name}.ts`;
      logger.info(`add watch file: ${ts.toString()}`);
      chokidar.watch(ts).on("change", () => {
        logger.info("change ts");
        buildCss(file, require(path.join(localPath, 'tailwind.config.js')), logger);
      });
    })
    .on("change", (file) => {
      logger.info("change css");
      buildCss(file, require(path.join(localPath, 'tailwind.config.js')), logger);
    });
};
