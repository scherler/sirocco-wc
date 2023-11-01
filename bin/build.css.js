const path = require('path');
const fs = require('fs');
const tailwindcss = require('tailwindcss');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const strip = require('strip-comments');


module.exports = (filePath, tailwindConfig, logger) => {
  // parse the filePath for use later
  // https://nodejs.org/api/path.html#pathparsepath
  const parsedFilePath = path.parse(filePath);
  // console.log(parsedFilePath,filePath);
  // figure out ahead of time what the output path should be
  // based on the original file path
  // ALL output files will end with `.styles.ts
  // since all outputs will be css as exported TS strings
  const styleTSFilePath = path.format({
    ...parsedFilePath,
    base: `${parsedFilePath.name}.styles.ts`,
  });

  // read the file contents
  // passing the encoding returns the file contents as a string
  // otherwise a Buffer would be returned
  // https://nodejs.org/api/fs.html#fsreadfilesyncpath-options
  let styleOutput = fs.readFileSync(filePath, { encoding: 'utf-8' });

  // wrap original file with tailwind at-rules
  // the css contents will become a "tailwind css" starter file
  //
  // https://tailwindcss.com/docs/installation#include-tailwind-in-your-css
  styleOutput = `@tailwind base;
@tailwind components;
@tailwind utilities;
${styleOutput}`;

  const tsFile = path.format({
    ...parsedFilePath,
    base: `${parsedFilePath.name}.ts`,
  });
  tailwindConfig.content = [tsFile];
  // fs.watchFile(tsFile, (curr, prev) => {
  //   console.log('ts', curr, prev);
  // })
  // now run postcss using tailwind and autoprefixer
  // and any other plugins you find necessary
  postcss([
    autoprefixer,
    tailwindcss(tailwindConfig),
    // ...other plugins
  ])
    // the 'from' property in the options makes sure that any
    // css imports are properly resolved as if processing from
    // the original file path
    .process(styleOutput, { from: filePath })
    .then(result => {
      // write your "css module" syntax
      // here its TS
      const cssToTSContents = `import { css } from 'lit';

export default css\`${strip(result.css.replace(/`/g, '').toString('utf8'))}\`;
`;

      // write the final file back to its location next to the
      // original .css/.scss file
      fs.writeFileSync(styleTSFilePath, cssToTSContents);
    });
};
