# Best Practices

## ✅ Do's

- Use global CSS variables for all colors
- Follow DRY principles - extract common patterns
- Use Material Web Components for standard UI elements
- Write semantic HTML with proper ARIA labels
- Test keyboard navigation in all components
- Keep components small and focused (Single Responsibility)
- Use Tailwind utilities instead of custom CSS
- Run `sirocco-wc buildCss` after editing .css files
- Test in both light and dark themes

## ❌ Don'ts

- Don't edit .styles.ts files manually (auto-generated)
- Don't hardcode colors in components
- Don't create component-specific theme systems
- Don't skip accessibility testing
- Don't mix imperative DOM manipulation with declarative rendering
- Don't forget to handle loading and error states
- Don't commit without linting and formatting

## Accessibility Requirements

- WCAG 2.1 Level AA compliance
- Keyboard navigation for all interactive elements
- Screen reader support with proper ARIA labels
- Focus indicators visible (min 2px outline)
- Color contrast ≥ 4.5:1 for normal text
- Color contrast ≥ 3:1 for large text and UI components
- Skip navigation links for keyboard users
- No flashing content (seizure risk)
