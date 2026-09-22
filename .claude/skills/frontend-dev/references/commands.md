# Commands Reference

## Development

```bash
# Watch CSS changes (auto-rebuild .styles.ts)
yarn sirocco:watch

# Start dev server
yarn dev

# Build for production
yarn build
```

## Component Management

```bash
# Add new component (components is default type)
sirocco-wc add MyComponent

# Add component with custom type
sirocco-wc add MyView -t views

# Build CSS to .styles.ts
sirocco-wc buildCss

# Watch CSS changes
sirocco-wc watchCss
```

## Testing

```bash
# Run all tests
yarn test

# E2E tests with Playwright
yarn test:e2e

# Watch mode
yarn test:watch
```
