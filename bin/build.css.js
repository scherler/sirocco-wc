const path = require('path');
const fs = require('fs');
const tailwindcssPostcss = require('@tailwindcss/postcss');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const strip = require('strip-comments');

/**
 * Tailwind v4 emits its `@property` fallback defaults inside
 * `@layer properties { @supports (...) { ... } }`. That feature-query gate does
 * not apply once the stylesheet is adopted into a Shadow DOM's own
 * `adoptedStyleSheets`, so the fallback defaults silently never take effect and
 * utilities that depend on them (ring, border, transform, ...) render as
 * nothing. Unwrapping the `@supports` gate makes the defaults unconditional.
 */
const unwrapShadowDomPropertyFallback = {
  postcssPlugin: 'unwrap-shadow-dom-property-fallback',
  OnceExit(root) {
    root.walkAtRules('layer', layerRule => {
      if (layerRule.params !== 'properties') return;
      layerRule.walkAtRules('supports', supportsRule => {
        supportsRule.replaceWith(supportsRule.nodes);
      });
    });
  },
};

module.exports = (filePath, themeCssPath, logger) => {
  const parsedFilePath = path.parse(filePath);
  const styleTSFilePath = path.format({
    ...parsedFilePath,
    base: `${parsedFilePath.name}.styles.ts`,
  });

  let styleOutput = fs.readFileSync(filePath, { encoding: 'utf-8' });

  const tsFile = path.format({
    ...parsedFilePath,
    base: `${parsedFilePath.name}.ts`,
  });
  const themeCssImportLine = themeCssPath
    ? `@import "${themeCssPath.replace(/\\/g, '/')}";`
    : '';
  // `source(none)` disables v4's automatic source detection, which would
  // otherwise leak sibling components' utility classes into every component's
  // own `.styles.ts`; `@source` then scopes the scan to this component alone.
  styleOutput = `@import "tailwindcss/theme.css";
${themeCssImportLine}
@import "tailwindcss/utilities.css" source(none);
@source "${tsFile.replace(/\\/g, '/')}";
${styleOutput}`;

  return postcss([
    tailwindcssPostcss(),
    unwrapShadowDomPropertyFallback,
    autoprefixer,
  ])
    .process(styleOutput, { from: filePath })
    .then(result => {
      const cssToTSContents = `import { css } from 'lit';

export default css\`${strip(result.css.replace(/`/g, ''))}\`;
`;
      fs.writeFileSync(styleTSFilePath, cssToTSContents);
    })
    .catch(err => {
      logger.error(err);
      throw err;
    });
};
