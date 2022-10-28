const fs = require("fs");
const shell = require("shelljs");
const prompt = require("prompt");

const templatePath = `${__dirname}/template`;
const localPath = process.cwd();
const localPathTmp = `${localPath}/tmp`;

module.exports = (logger) => {
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
        logger.info("⚠️Please make sure to update the index.html to point to the correct entrypoint in your js code.⚠️");
    });
};
