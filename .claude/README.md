# .claude Directory Structure

This directory contains all Claude Code generated documentation, analysis, reports, and task tracking for the sirocco-wc project.

## Directory Organization

### `/analysis`
**Purpose**: Codebase analysis, enhancement suggestions, technical reviews

**Contents**:
- Code quality assessments
- Enhancement proposals
- Technical debt analysis
- Performance reviews
- Security audits

**Example Files**:
- `ENHANCEMENTS.md` - Comprehensive codebase improvements (2025-10-22)

### `/reports`
**Purpose**: Regular reports, summaries, status updates

**Contents**:
- Weekly/monthly summaries
- Test coverage reports
- Build performance reports
- Dependency audit reports
- Release notes

**Example Files**:
- `test-coverage-YYYY-MM-DD.md`
- `dependency-audit-YYYY-MM-DD.md`

### `/tasks`
**Purpose**: Task planning, work breakdown, project management

**Contents**:
- Feature implementation plans
- Bug fix strategies
- Refactoring roadmaps
- Sprint plans
- Task checklists

**Example Files**:
- `typescript-migration-plan.md`
- `testing-implementation-Q1-2025.md`

### `/docs`
**Purpose**: Technical documentation, guides, references

**Contents**:
- Architecture diagrams
- API documentation
- Design decisions
- Best practices guides
- Troubleshooting guides

**Example Files**:
- `architecture-overview.md`
- `component-patterns.md`

## File Naming Conventions

### General Format
```
{topic}-{type}-{date}.md
```

### Examples
```
enhancements-analysis-2025-10-22.md
test-coverage-report-2025-10-22.md
typescript-migration-task-2025-10-22.md
css-build-performance-docs-2025-10-22.md
```

### Date Format
- Use ISO format: `YYYY-MM-DD`
- Append to filename when version matters
- Omit date for living documents

## Document Templates

### Analysis Document
```markdown
# [Analysis Title]

**Date**: YYYY-MM-DD
**Analyzer**: Claude Code / Human Name
**Status**: Draft | Review | Final

## Executive Summary
Brief overview of findings

## Scope
What was analyzed

## Findings
Detailed analysis

## Recommendations
Actionable suggestions

## Appendix
Supporting data
```

### Task Document
```markdown
# [Task Title]

**Created**: YYYY-MM-DD
**Status**: Planned | In Progress | Completed | Blocked
**Priority**: High | Medium | Low
**Assignee**: Name/Team

## Objective
What needs to be accomplished

## Requirements
Specific requirements

## Implementation Steps
1. Step one
2. Step two

## Acceptance Criteria
- [ ] Criterion one
- [ ] Criterion two

## Notes
Additional context
```

### Report Document
```markdown
# [Report Title]

**Period**: YYYY-MM-DD to YYYY-MM-DD
**Generated**: YYYY-MM-DD
**Type**: Weekly | Monthly | Quarterly | Annual

## Summary
High-level overview

## Metrics
Key metrics and KPIs

## Highlights
Notable achievements

## Issues
Problems encountered

## Next Period
Plans for next period
```

## Maintenance

### Cleanup Guidelines
- Archive documents older than 6 months to `/archive`
- Remove outdated analysis after implementation
- Keep only latest report for recurring reports
- Maintain index of important decisions

### Archive Structure
```
.claude/
  archive/
    2024/
      Q4/
        analysis/
        reports/
        tasks/
```

## Integration with CLAUDE.md

The main `CLAUDE.md` file in the root provides high-level project guidance. This `.claude` directory contains detailed, dated work products. Reference key documents from `CLAUDE.md` when appropriate.

## Usage Examples

### Creating a New Analysis
```bash
cd .claude/analysis
touch css-build-optimization-analysis-2025-10-22.md
# Write analysis...
```

### Finding Past Reports
```bash
ls -lt .claude/reports/  # List by date
grep -r "test coverage" .claude/reports/
```

### Task Tracking
```bash
# Create task
echo "# TypeScript Migration" > .claude/tasks/typescript-migration-2025-10-22.md

# Update task status
sed -i 's/Status: Planned/Status: In Progress/' .claude/tasks/typescript-migration-2025-10-22.md
```

## Best Practices

1. **Be Specific**: Use descriptive filenames
2. **Date Everything**: Include creation/update dates
3. **Status Tracking**: Keep status current
4. **Link Related Docs**: Reference related documents
5. **Regular Cleanup**: Archive old documents quarterly
6. **Version Control**: Commit to git for history

## Contact

For questions about this structure or document organization, see project README or open an issue.

---

Last Updated: 2025-10-22
