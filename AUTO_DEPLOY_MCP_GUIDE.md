# Auto Deploy MCP - Complete Deployment Automation

## Overview

The Auto Deploy MCP provides comprehensive deployment automation for Converto Business OS, handling the entire pipeline from code changes to production deployment.

## Features

- **Git Operations**: Status checks, commits, and pushes
- **Build Management**: Frontend builds with error handling
- **Testing**: Automated test execution
- **Cloud Deployment**: Render and Vercel deployment support
- **Health Monitoring**: Deployment health checks
- **Pipeline Orchestration**: Complete CI/CD pipeline automation

## Setup

### 1. Environment Variables

Add these to your `.env` file or Cursor MCP configuration:

```bash
# Required for Render deployments
RENDER_API_KEY=your_render_api_key

# Optional for enhanced Git operations
GITHUB_TOKEN=your_github_token

# Optional for Vercel deployments
VERCEL_TOKEN=your_vercel_token
```

### 2. MCP Configuration

Add to your Cursor MCP settings:

```json
{
  "mcpServers": {
    "auto-deploy-tools": {
      "command": "node",
      "args": ["/path/to/converto-business-os-quantum-mvp/mcp_auto_deploy_server.js"],
      "env": {
        "RENDER_API_KEY": "${RENDER_API_KEY}",
        "GITHUB_TOKEN": "${GITHUB_TOKEN}",
        "VERCEL_TOKEN": "${VERCEL_TOKEN}"
      }
    }
  }
}
```

## Available Tools

### Git Operations

#### `git_status_check`
Check current git status and pending changes.
```javascript
// Parameters
{
  "repo_path": "." // optional, defaults to current directory
}
```

#### `git_commit_and_push`
Stage, commit, and push all changes.
```javascript
// Parameters
{
  "message": "feat: add new landing page features",
  "repo_path": ".", // optional
  "branch": "main" // optional
}
```

### Build & Test

#### `build_frontend`
Build the Next.js application.
```javascript
// Parameters
{
  "frontend_path": "./frontend", // optional
  "build_command": "npm run build" // optional
}
```

#### `run_tests`
Execute test suites.
```javascript
// Parameters
{
  "test_command": "npm test", // optional
  "frontend_path": "./frontend" // optional
}
```

### Deployment

#### `render_deploy_status`
Check Render deployment status.
```javascript
// Parameters
{
  "service_id": "srv-d3r10pjipnbc73asaod0" // your Render service ID
}
```

#### `render_trigger_deploy`
Trigger new Render deployment.
```javascript
// Parameters
{
  "service_id": "srv-d3r10pjipnbc73asaod0"
}
```

#### `vercel_deploy`
Deploy to Vercel.
```javascript
// Parameters
{
  "project_name": "converto-business-os",
  "frontend_path": "./frontend" // optional
}
```

### Health Monitoring

#### `check_deployment_health`
Verify deployment is responding correctly.
```javascript
// Parameters
{
  "url": "https://converto.fi",
  "service_id": "srv-d3r10pjipnbc73asaod0" // optional
}
```

### Complete Pipeline

#### `full_deployment_pipeline`
Run the entire deployment workflow.
```javascript
// Parameters
{
  "commit_message": "feat: premium landing page finalization",
  "service_id": "srv-d3r10pjipnbc73asaod0",
  "skip_tests": false, // optional
  "frontend_path": "./frontend" // optional
}
```

## Usage Examples

### Quick Deploy (Development)
```javascript
// Use the full_deployment_pipeline tool
{
  "commit_message": "feat: add new feature",
  "service_id": "srv-d3r10pjipnbc73asaod0",
  "skip_tests": true
}
```

### Production Deploy (Recommended)
```javascript
// Use the full_deployment_pipeline tool
{
  "commit_message": "feat: premium landing page with StoryBrand framework",
  "service_id": "srv-d3r10pjipnbc73asaod0",
  "skip_tests": false
}
```

### Manual Step-by-Step Deploy
```javascript
// 1. Check git status
await git_status_check({})

// 2. Run tests
await run_tests({})

// 3. Build frontend
await build_frontend({})

// 4. Commit and push
await git_commit_and_push({
  "message": "feat: your feature description"
})

// 5. Deploy to Render
await render_trigger_deploy({
  "service_id": "srv-d3r10pjipnbc73asaod0"
})

// 6. Check deployment health
await check_deployment_health({
  "url": "https://converto.fi",
  "service_id": "srv-d3r10pjipnbc73asaod0"
})
```

## Workflows

### Production Deployment
1. `git_status_check` - Verify working directory
2. `run_tests` - Ensure code quality
3. `build_frontend` - Build optimized assets
4. `git_commit_and_push` - Version control
5. `render_trigger_deploy` - Deploy to production
6. `check_deployment_health` - Verify deployment

### Quick Iteration (Development)
1. `git_commit_and_push` - Fast version control
2. `build_frontend` - Build assets
3. `render_trigger_deploy` - Deploy quickly

## Error Handling

The MCP provides comprehensive error handling:
- Git operation failures
- Build failures with detailed logs
- Test failures with output
- Deployment failures with status codes
- Health check failures with diagnostics

## Integration with Cursor

Once configured, you can use these tools directly in Cursor by mentioning them in your queries:

- "Deploy the current changes to production"
- "Check if the latest deployment is healthy"
- "Run the full deployment pipeline"

The MCP will automatically execute the appropriate tools and provide real-time feedback on the deployment process.

## Security Notes

- API keys are stored securely in environment variables
- No sensitive data is logged or exposed
- All operations are performed with proper authentication
- Network requests use HTTPS with certificate validation
