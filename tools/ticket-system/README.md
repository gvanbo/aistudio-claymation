# NSA Ticket Management System

A comprehensive XML-based ticket system for coordinating work across all teams in the NorthStar Academy HTML content management project.

## Overview

This system provides structured issue tracking, status communication, and workflow coordination across:

- **Content Team** - Course creation and pedagogical design
- **Development Team** - Agent system and tooling development
- **Asset Team** - Image, QR code, and resource management
- **QA Team** - Quality assurance and validation
- **Infrastructure Team** - R2 storage, GitHub, and deployment

## Quick Start

### Create a New Ticket

```bash
# Content team ticket
node ticket-system/create-ticket.js --type content --priority high --title "SS1 Unit 2 needs activity icons"

# Development ticket
node ticket-system/create-ticket.js --type development --priority medium --title "Asset manager QR generation bug"

# Asset management ticket
node ticket-system/create-ticket.js --type asset --priority low --title "Optimize character image sizes"
```

### Update Ticket Status

```bash
node ticket-system/update-ticket.js --id NSA-2025-001 --status in-progress --assignee john.doe
```

### View Active Tickets

```bash
node ticket-system/list-tickets.js --team content --status open
node ticket-system/dashboard.js --summary
```

## Ticket Structure

All tickets use standardized XML format with team-specific extensions:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ticket xmlns="https://nsa-images.org/schemas/ticket/v1.0">
  <metadata>
    <id>NSA-2025-001</id>
    <type>content</type>
    <priority>high</priority>
    <status>open</status>
    <created>2025-08-04T10:30:00Z</created>
    <updated>2025-08-04T10:30:00Z</updated>
  </metadata>

  <assignment>
    <team>content</team>
    <assignee>jane.smith</assignee>
    <reviewer>team-lead</reviewer>
    <estimated_hours>4</estimated_hours>
  </assignment>

  <description>
    <title>Create SS1 Unit 2 activity icons for Engage section</title>
    <summary>Need 5 new activity icons for Social Studies Grade 1 Unit 2 Engage activities</summary>
    <details>
      The Engage section requires custom icons for:
      - Map exploration activity
      - Community helper identification
      - Geography matching game
      - Local landmarks discussion
      - Cultural traditions sharing
    </details>
  </description>

  <requirements>
    <deliverable>5 SVG icons at 175px width</deliverable>
    <acceptance_criteria>Icons must follow NSA style guide and be accessible</acceptance_criteria>
    <dependencies>
      <dependency id="NSA-2025-002" type="blocks">Asset style guide approval</dependency>
    </dependencies>
  </requirements>

  <progress>
    <current_status>Design mockups completed, awaiting approval</current_status>
    <next_steps>
      <step priority="1">Get design approval from content lead</step>
      <step priority="2">Create final SVG files</step>
      <step priority="3">Upload to R2 bucket and update icon-map.json</step>
    </next_steps>
    <blockers>
      <blocker>Waiting for style guide finalization</blocker>
    </blockers>
  </progress>

  <communication>
    <updates>
      <update timestamp="2025-08-04T10:30:00Z" author="jane.smith">
        Initial ticket creation. Started design research.
      </update>
    </updates>
    <github_issues>
      <issue url="https://github.com/nsa/html-content/issues/123">#123</issue>
    </github_issues>
  </communication>

  <team_specific>
    <content>
      <lesson_metadata>
        <subject>social_studies</subject>
        <grade>1</grade>
        <unit>2</unit>
        <section>engage</section>
      </lesson_metadata>
      <pedagogical_notes>Icons should support kinesthetic learning styles</pedagogical_notes>
    </content>
  </team_specific>
</ticket>
```

## Team-Specific Workflows

### Content Team Tickets

- **Focus**: Curriculum design, lesson creation, pedagogical requirements
- **Key Fields**: lesson_metadata, learning_objectives, accessibility_requirements
- **Integration**: Google Docs, Moodle content standards

### Development Team Tickets

- **Focus**: Agent system, tooling, code quality
- **Key Fields**: code_impact, testing_requirements, performance_metrics
- **Integration**: GitHub issues, CI/CD pipelines, code reviews

### Asset Team Tickets

- **Focus**: Images, QR codes, R2 storage, visual resources
- **Key Fields**: asset_specifications, storage_paths, optimization_targets
- **Integration**: R2 bucket management, asset validation tools

### QA Team Tickets

- **Focus**: Quality assurance, validation, testing coordination
- **Key Fields**: test_coverage, validation_criteria, quality_metrics
- **Integration**: Automated testing, validation reports, audit trails

### Infrastructure Team Tickets

- **Focus**: Systems, deployment, performance, security
- **Key Fields**: system_impact, deployment_requirements, monitoring_setup
- **Integration**: GitHub Actions, monitoring tools, security scanning

## Directory Structure

```
ticket-system/
├── README.md                    # This documentation
├── schemas/                     # XML schema definitions
│   ├── ticket-base.xsd         # Core ticket schema
│   ├── content-extensions.xsd   # Content team extensions
│   ├── development-extensions.xsd
│   ├── asset-extensions.xsd
│   ├── qa-extensions.xsd
│   └── infrastructure-extensions.xsd
├── templates/                   # Ticket templates
│   ├── content-ticket.xml
│   ├── development-ticket.xml
│   ├── asset-ticket.xml
│   ├── qa-ticket.xml
│   └── infrastructure-ticket.xml
├── tools/                       # Management scripts
│   ├── create-ticket.js        # Ticket creation tool
│   ├── update-ticket.js        # Status update tool
│   ├── list-tickets.js         # Query and filtering
│   ├── dashboard.js            # Team dashboard
│   ├── validate-ticket.js      # XML validation
│   └── github-sync.js          # GitHub integration
├── active/                      # Active tickets by team
│   ├── content/
│   ├── development/
│   ├── asset/
│   ├── qa/
│   └── infrastructure/
├── archived/                    # Completed tickets
│   └── 2025/
├── config/                      # System configuration
│   ├── settings.json
│   ├── team-config.json
│   └── github-integration.json
└── reports/                     # Generated reports
    ├── weekly-status.md
    ├── team-metrics.json
    └── burndown-charts/
```

## Status Workflow

### Standard Status Flow

1. **`open`** - Newly created, awaiting assignment
2. **`assigned`** - Assigned to team member, work not started
3. **`in-progress`** - Active work in progress
4. **`blocked`** - Work stopped due to dependencies/issues
5. **`review`** - Work completed, awaiting review/approval
6. **`testing`** - Under QA testing or validation
7. **`done`** - Completed and verified
8. **`archived`** - Closed and archived

### Priority Levels

- **`critical`** - System breaking, immediate attention required
- **`high`** - Important feature/fix, complete within 1-2 days
- **`medium`** - Standard priority, complete within 1 week
- **`low`** - Nice to have, complete when capacity allows
- **`backlog`** - Future consideration, no immediate timeline

## GitHub Integration

### Automatic Issue Creation

```javascript
// When ticket reaches 'in-progress' status
const githubIssue = {
  title: ticket.description.title,
  body: generateIssueBody(ticket),
  labels: [ticket.metadata.type, ticket.metadata.priority, ticket.assignment.team],
  assignees: [ticket.assignment.assignee],
  milestone: ticket.requirements.milestone,
};
```

### Commit Message Integration

```bash
# Reference tickets in commits
git commit -m "feat: implement QR code validation (NSA-2025-045)

- Add bucket inventory validation
- Implement fallback QR generation
- Update asset manager tests

Closes NSA-2025-045"
```

### Pull Request Templates

```markdown
## Ticket Reference

- **Ticket ID**: NSA-2025-XXX
- **Team**: Development
- **Type**: Feature/Bug Fix/Enhancement

## Changes Made

- [ ] Core functionality implemented
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Team notification sent

## Next Steps

- [ ] QA validation required
- [ ] Asset team coordination needed
- [ ] Content team review pending
```

## Communication Standards

### Update Frequency

- **Critical tickets**: Real-time updates as work progresses
- **High priority**: Daily status updates
- **Medium priority**: Updates every 2-3 days
- **Low priority**: Weekly updates or milestone completion

### Status Communication Format

```xml
<update timestamp="2025-08-04T15:30:00Z" author="developer.name">
  <status_change from="assigned" to="in-progress" />
  <work_completed>
    - Implemented QR code generation logic
    - Added error handling for missing assets
    - Created unit tests for validation functions
  </work_completed>
  <next_actions>
    - Integration with asset manager agent
    - End-to-end testing with sample content
  </next_actions>
  <blockers>None</blockers>
  <estimated_completion>2025-08-05T17:00:00Z</estimated_completion>
</update>
```

## Reporting and Analytics

### Team Dashboard Metrics

- Open tickets by priority and team
- Average resolution time by ticket type
- Blocked tickets and dependency chains
- Team workload distribution
- Sprint/milestone progress tracking

### Weekly Status Reports

```markdown
# NSA Project Status - Week of August 4, 2025

## Overall Progress

- **Total Active Tickets**: 23
- **Completed This Week**: 8
- **Critical Issues**: 0
- **Blocked Tickets**: 2

## Team Status

### Content Team (6 active tickets)

- ✅ SS1 Unit 1 icons completed
- 🔄 SS1 Unit 2 in progress
- ⚠️ Grade 2 curriculum delayed (waiting for approval)

### Development Team (8 active tickets)

- ✅ Asset manager QR bug fixed
- 🔄 Template generator optimization ongoing
- 🔄 New validation rules implementation

### Asset Team (4 active tickets)

- ✅ R2 bucket cleanup completed
- 🔄 Character image optimization in progress

### QA Team (3 active tickets)

- ✅ Validation framework testing complete
- 🔄 End-to-end workflow testing ongoing

### Infrastructure Team (2 active tickets)

- 🔄 GitHub Actions optimization
- 🔄 Monitoring dashboard setup
```

## Best Practices

### Ticket Creation

1. **Clear, specific titles** - Describe the work, not the problem
2. **Detailed requirements** - Include acceptance criteria and deliverables
3. **Proper categorization** - Use correct team and type classifications
4. **Dependency mapping** - Identify blocking and blocked relationships
5. **Realistic estimates** - Include buffer time for review and testing

### Status Management

1. **Regular updates** - Keep status current with actual work progress
2. **Clear next steps** - Always specify what happens next
3. **Blocker communication** - Immediately flag and communicate blockers
4. **Team coordination** - Tag relevant teams for cross-functional work
5. **Documentation** - Link to related GitHub issues, PRs, and documents

### Team Coordination

1. **Cross-team dependencies** - Use ticket references for coordination
2. **Escalation paths** - Clear process for urgent issues and blockers
3. **Review cycles** - Built-in checkpoints for quality and alignment
4. **Knowledge sharing** - Document decisions and learnings in tickets
5. **Retrospectives** - Regular review of ticket system effectiveness

This ticket system provides structured communication, clear accountability, and efficient coordination across all teams while maintaining GitHub integration and following development best practices.
