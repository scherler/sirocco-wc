const fs = require("fs");
const shell = require("shelljs");
const prompt = require("prompt");

const localPath = process.cwd();
const localPathTmp = `${localPath}/tmp`;

module.exports = (logger, options) => {
    const templateType = options?.template || 'default';
    const templatePath = `${__dirname}/${templateType === 'showcase' ? 'showcase-template' : 'template'}`;

    logger.info(`Using '${templateType}' template...`);
    logger.info("Copying files to temp dir…");
    shell.mkdir(localPathTmp)
    shell.cp("-R", `${templatePath}/*`, localPathTmp);
    shell.cp("-R", `${templatePath}/.*`, localPathTmp);
    logger.info("✔ The files have been copied!");
    const variables = require(`${templatePath}/_variables.js`);

    // Remove variables file from the current directory
    // since it only is needed on the template directory
    if (fs.existsSync(`${localPathTmp}/_variables.js`)) {
        shell.rm(`${localPathTmp}/_variables.js`);
    }

    logger.info("Please fill the following values…");

    // Ask for variable values
    prompt.start().get(variables, (err, result) => {
        logger.info("Start replacing, please be patient!");
        // Replace variable values in all files
        shell.ls("-Rl", "./tmp").forEach((entry) => {
            if (entry.isFile() && !entry.name.startsWith('node_modules') && !entry.name.startsWith('dist')) {
                logger.info(`Replacing ${entry.name}`);
                // Replace '[VARIABLE]` with the corresponding variable value from the prompt
                variables.forEach((variable) => {
                    shell.sed(
                        "-i",
                        `\\[${variable.name.toUpperCase()}\\]`,
                        result[variable.name],
                        'tmp/'+entry.name
                    );
                });
            }
        });
        logger.info("Moving files to final destination");

        shell.mv(`${localPathTmp}/_.gitignore`, `${localPathTmp}/.gitignore`);
        shell.mv(`${localPathTmp}/.*`, localPath);
        shell.mv(`${localPathTmp}/*`, localPath);
        shell.rm('-rf', localPathTmp)

        logger.info("✔ Success!");
        if (!process.env.SWC_SKIP_POSTINIT) {
            const run = (cmd, description) => {
                logger.info(`${description}...`);
                const result = shell.exec(cmd);
                if (result.code !== 0) {
                    logger.error(`✗ ${description} failed (exit code ${result.code}). Stopping — fix the error above and re-run the remaining setup manually:`);
                    logger.error(`  yarn set version 4.18.0 && yarn install && yarn dlx @yarnpkg/sdks vscode`);
                    process.exit(result.code);
                }
            };
            run('yarn set version 4.18.0', 'Setting up Yarn 4.18.0 (Berry)');
            run('yarn install', 'Installing dependencies');
            // interactive-tools and typescript are built into Yarn 4.18.0 — `yarn plugin
            // import` now errors ("already installed") if you ask for either explicitly.
            run('yarn dlx @yarnpkg/sdks vscode', 'Setting up VSCode SDKs');
        }
        logger.info("⚠️Please make sure to update the index.html to point to the correct entrypoint in your js code.⚠️");
    });
};
