#!/usr/bin/env node

const { program } = require("@caporal/core");
const init = require("./init.js");
const add = require("./add.js");
const buildCss = require("./build.styles.js");
const watchCss = require("./build.watch.js");
const { defaultComponentType, sversion } = require("./config");

program
    .version(sversion)
    .command("init", "Scaffolding your project")
    .alias("i")
    .action(({ logger }) => {
        init(logger);
    })
    .command("add", "add component")
    .alias("a")
    .argument("<component>", "Name of the component")
    .option("-t, --type <type>", "Component Type", {
        default: defaultComponentType,
    })
    .action(({ logger, args, options }) => {
        add(logger, args, options);
        buildCss(logger);
    })
    .command("buildCss", "Building style.ts files")
    .alias("bc")
    .action(({ logger }) => {
        buildCss(logger);
    })
    .command("watchCss", "Watch changes and rebuild")
    .alias("wc")
    .action(({ logger }) => {
        watchCss(logger);
    })
    ;

program.run();
