#!/bin/bash

# Auto Deploy MCP Test Script
# Tests the MCP server functionality

echo "🧪 Testing Auto Deploy MCP Server..."
echo "=================================="

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed or not in PATH"
    exit 1
fi

# Check if the MCP server file exists
if [ ! -f "mcp_auto_deploy_server.js" ]; then
    echo "❌ MCP server file not found: mcp_auto_deploy_server.js"
    exit 1
fi

# Check if required dependencies are installed
if ! node -e "require('@modelcontextprotocol/sdk')" 2>/dev/null; then
    echo "⚠️  MCP SDK not found. Installing dependencies..."
    npm install @modelcontextprotocol/sdk
fi

echo "✅ Basic setup checks passed"

# Test syntax validation
echo "🔍 Validating JavaScript syntax..."
if node -c mcp_auto_deploy_server.js; then
    echo "✅ Syntax validation passed"
else
    echo "❌ Syntax validation failed"
    exit 1
fi

# Test JSON configuration
echo "🔍 Validating JSON configuration..."
if node -e "JSON.parse(require('fs').readFileSync('mcp_auto_deploy_tools.json', 'utf8'))"; then
    echo "✅ JSON configuration valid"
else
    echo "❌ JSON configuration invalid"
    exit 1
fi

echo ""
echo "🎉 Auto Deploy MCP Server is ready!"
echo ""
echo "To use in Cursor:"
echo "1. Add the MCP server to your Cursor configuration"
echo "2. Set environment variables: RENDER_API_KEY, GITHUB_TOKEN (optional), VERCEL_TOKEN (optional)"
echo "3. Use commands like 'Deploy the current changes' or 'Check deployment status'"
echo ""
echo "Available tools:"
echo "- git_status_check: Check git status"
echo "- git_commit_and_push: Commit and push changes"
echo "- build_frontend: Build Next.js app"
echo "- run_tests: Execute test suites"
echo "- render_deploy_status: Check Render deployment"
echo "- render_trigger_deploy: Trigger Render deployment"
echo "- full_deployment_pipeline: Complete CI/CD pipeline"
echo "- check_deployment_health: Verify deployment health"
echo ""
echo "See AUTO_DEPLOY_MCP_GUIDE.md for detailed usage instructions."
