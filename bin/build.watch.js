const path = require("path");
const chokidar = require("chokidar");

const buildCss = require("./build.css.js");
const { source, themeCssPath } = require("./config");

module.exports = (logger) => {
  // chokidar v4 dropped built-in glob support: watch the source *directory*
  // recursively and filter to `.css` files with `ignored` instead of passing a
  // `**/*.css` glob. Directories must not be ignored or the walk never
  // descends, hence the `stats.isFile()` guard.
  chokidar
    .watch(source, {
      ignored: (p, stats) => !!stats && stats.isFile() && !p.endsWith(".css"),
    })
    .on("add", (file) => {
      const parsed = path.parse(file);
      const ts = `${parsed.dir}${path.sep}${parsed.name}.ts`;
      logger.info(`add watch file: ${ts.toString()}`);
      chokidar.watch(ts).on("change", () => {
        logger.info("change ts");
        // buildCss rejects (and has already logged) on a CSS error. A watcher
        // must survive that, so swallow here instead of letting it become an
        // unhandled rejection, which would kill the process.
        buildCss(file, themeCssPath, logger).catch(() => {});
      });
    })
    .on("change", (file) => {
      logger.info("change css");
      buildCss(file, themeCssPath, logger).catch(() => {});
    });
};
