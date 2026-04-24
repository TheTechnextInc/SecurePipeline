# SecurePipe - DevSecOps Pipeline Visualization Platform

A comprehensive DevSecOps dashboard for monitoring CI/CD pipelines, tracking security vulnerabilities, and enforcing quality gates.

## Quick Start

1. **Login with default credentials:**
   - Email: `admin@securepipe.dev`
   - Password: `Admin@123456`

2. **Explore the dashboard:**
   - View pipeline status and execution stages
   - Monitor security vulnerabilities
   - Configure quality gates
   - Generate compliance reports

## Features

### Pipeline Management
- Visual pipeline execution with animated stages (Source → Build → SAST → Test → Deploy)
- Real-time status updates
- Automatic security gate enforcement
- Create and manage multiple pipelines per repository

### Security Scanning
- SAST vulnerability detection simulation
- Severity-based categorization (Critical, High, Medium, Low)
- CWE classification with external links
- OWASP Top 10 mapping
- Export vulnerabilities as CSV

### Quality Gates
- Configurable pass/fail conditions
- Metrics: Coverage, Duplicated Lines, Security Rating, Vulnerabilities
- Block deployments on quality gate failure

### Reports & Analytics
- Vulnerability trend charts
- Coverage trend visualization
- Pipeline activity metrics
- Scheduled report generation

### Notifications
- Real-time alerts for pipeline events
- Security scan results
- Quality gate status changes

## How Pipeline Pass/Fail Works

Pipelines automatically **PASS** or **FAIL** based on security vulnerabilities:

- **PASSES**: When the repository has NO open critical or high severity vulnerabilities
- **FAILS**: When the repository has ANY open critical or high severity vulnerabilities

### To make a failing pipeline pass:
1. Go to **Security Scans** page
2. Find the critical/high severity vulnerabilities
3. Click "Fix" or "Ignore" on each one
4. Return to **Pipelines** and click "Run"

### To test with a clean pipeline:
1. Go to **Settings** → **Integrations** → **GitHub**
2. Click "Add Repository" and enter any repo name
3. Go to **Pipelines** → "New Pipeline"
4. Select your new repo and create the pipeline
5. Click "Run" - it will pass (no vulnerabilities)

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **State**: React Context API
- **Auth**: Local cookie-based authentication

## Authentication

This demo uses local cookie-based authentication. Two demo accounts are available:

| Account | Email | Password |
|---------|-------|----------|
| Admin | admin@securepipe.dev | Admin@123456 |
| Demo | demo@securepipe.dev | Demo@123456 |

Sessions are stored in HTTP-only cookies and expire after 7 days.

## Data Persistence

**Important**: This is a demonstration platform. All data is stored in React Context (client-side state) and will reset when you:
- Refresh the browser
- Close the tab
- Log out and back in

For production use, integrate with a real database.

## Documentation

For detailed explanations of how each feature works:
- See `PROJECT_WORKING_EXPLANATION.txt` for complete technical documentation
- See `PIPELINE_BEHAVIOR_EXPLANATION.txt` for pipeline logic details

## Adding Repositories

When you add a new repository:
1. It appears in the connected repos list
2. A pipeline is automatically created
3. Sample vulnerabilities are added for testing
4. All dashboard metrics update immediately

## Project Structure

```
/
├── app/                    # Next.js App Router pages
│   ├── api/auth/          # Auth API routes (login, logout)
│   ├── auth/              # Login, sign-up, error pages
│   ├── pipelines/         # Pipeline management
│   ├── security/          # Security scans
│   ├── quality-gates/     # Quality gate config
│   ├── reports/           # Analytics & reports
│   ├── notifications/     # Alert management
│   └── settings/          # Integrations & config
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── *.tsx             # Dashboard components
├── lib/
│   ├── auth.ts           # Authentication logic
│   ├── store.tsx         # Global state management
│   └── utils.ts          # Utility functions
└── middleware.ts          # Route protection
```

## License

MIT
