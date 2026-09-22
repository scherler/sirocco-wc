# AGENTS.md

Guidance for AI coding agents working in this repository. This project's primary
agent guidance lives in [CLAUDE.md](./CLAUDE.md) — read that first; this file is
a thin pointer for tools that look for `AGENTS.md` specifically, not a
duplicate to keep in sync by hand.

## Quick orientation

- **What this is**: a CLI scaffolding tool (`bin/`) that fuses Lit web
  components with Tailwind CSS v4, plus two project templates
  (`bin/template/`, `bin/showcase-template/`). See [CLAUDE.md](./CLAUDE.md)
  for the full architecture.
- **Frontend development skill**: `.claude/skills/frontend-dev/` — component
  patterns, global theming (`theme.css`'s `@theme` block), DRY composition,
  accessibility. Load it before writing or reviewing Lit/Tailwind component
  code in this repo or in a project scaffolded from its templates.
- **Self-check before claiming something works**: `yarn lint`,
  `yarn typecheck`, `yarn selftest`, and `node scripts/validate-templates.js`
  (scaffolds both templates via the local CLI and runs their full
  install/build/lint cycle) — see CLAUDE.md's "Common Development Commands".
- **Never edit** `*.styles.ts` files (auto-generated) or `bin/template/`'s
  and `bin/showcase-template/`'s deleted `tailwind.config.js` — this project
  moved to CSS-native `theme.css` `@theme` blocks; there is no JS Tailwind
  config anymore.
