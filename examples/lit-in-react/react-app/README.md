# The React host app for the Lit-in-React PoC

> **Start at [../README.md](../README.md)** — that is where the integration is
> documented. This app is the proof that the documentation is runnable.
>
> ```bash
> cd ../lit-component && npm install && npm run css:build
> cd ../react-app   && npm install && npm run build   # tsc -b && vite build
> npm run dev                                          # http://localhost:5173
> ```
>
> This is a stock `npm create vite@latest -- --template react-ts` scaffold with
> exactly four hand-edited files:
>
> | File | Edit |
> | --- | --- |
> | `package.json` | added `"lit-component": "file:../lit-component"`; pinned all versions exactly (no `^`/`~`) |
> | `tsconfig.app.json` | added `experimentalDecorators` + `useDefineForClassFields: false` for Lit's legacy decorators |
> | `src/App.tsx` | replaced the stock demo markup with the PoC |
> | `src/index.css` | appended bare `button`/`ul`/`li` rules, as a visible Shadow DOM isolation test |
>
> Everything else — `src/App.css`, `src/assets/*`, `public/*`, `vite.config.ts`,
> the tsconfigs, `.oxlintrc.json` — is untouched scaffold output, deliberately
> left as generated so this app stays comparable to a fresh scaffold run. Some of
> the stock demo styles and assets are consequently unreferenced; that is
> expected, not an oversight.
>
> The rest of this file is the scaffold's own generated README.

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
