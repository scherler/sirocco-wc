// Note: this file only affects Parcel's own global CSS bundling pass.
// Per-component CSS (.css -> .styles.ts, run via `sirocco-wc buildCss`) goes
// through bin/build.css.js's own separate postcss+autoprefixer pipeline and
// never reads this file. Parcel already vendor-prefixes by default, so
// autoprefixer isn't listed here (it would be a redundant no-op warning).
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
