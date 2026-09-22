# Frontend Development - Reference Documentation

This directory contains detailed reference documentation for Sirocco frontend development patterns, extracted from the main SKILL.md for context optimization.

## Structure

**Main Skill File**: `../SKILL.md` (~155 lines)
- Overview and key features
- Quick reference for common tasks
- References to detailed documentation

**Detailed Documentation** (loaded on-demand):

### core-principles.md
- Global CSS variables pattern
- DRY component composition
- Material Web Components integration
- Tailwind utility-first CSS
- **Use when**: Understanding fundamental design patterns

### component-patterns.md
- Creating new components with sirocco-wc CLI
- Component structure and organization
- Global theme setup
- **Use when**: Building new components, setting up projects

### material-web-components.md
- Commonly used Material Web Components
- Import patterns
- Component categories (buttons, forms, feedback, layout)
- **Use when**: Integrating Material Design components

### commands.md
- Development commands
- Component management commands
- Testing commands
- **Use when**: Running builds, tests, or component operations

### best-practices.md
- Do's and Don'ts
- Accessibility requirements
- Code quality guidelines
- **Use when**: Code review, establishing standards

### workflow/
Detailed step-by-step guides:
- `step1-init-project.md` - Project initialization
- `step2-create-component.md` - Component creation
- `step3-global-theme.md` - Global theming setup
- `step4-best-practices.md` - DRY implementation patterns
- `step5-testing.md` - Testing and accessibility

## Token Optimization

**Before**: 432 lines in SKILL.md (~860 tokens)
**After**: 155 lines in SKILL.md (~310 tokens) + 5 reference files + 5 workflow files (loaded on-demand)
**Savings**: ~550 tokens at plugin load time (64% reduction)

## Usage Pattern

Claude will:
1. Load the slim SKILL.md at plugin invocation
2. Reference detailed docs when answering specific questions
3. Read reference files on-demand using the Read tool
4. Direct users to workflow guides for step-by-step instructions

## Maintenance

When updating this skill:
- Keep SKILL.md under 200 lines
- Extract detailed patterns to reference files
- Keep workflow/ guides for step-by-step instructions
- Update this README if adding new reference files
