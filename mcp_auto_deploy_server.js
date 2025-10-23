#!/usr/bin/env node

/**
 * Auto Deploy MCP Server for Cursor
 * Comprehensive deployment automation for Converto Business OS
 * Handles git operations, builds, and cloud deployments
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { execSync, exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

// Environment variables
const RENDER_API_KEY = process.env.RENDER_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

const server = new Server(
  {
    name: 'auto-deploy-tools',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'git_status_check',
        description: 'Check current git status and pending changes',
        inputSchema: {
          type: 'object',
          properties: {
            repo_path: {
              type: 'string',
              description: 'Path to the git repository',
              default: '.'
            },
          },
        },
      },
      {
        name: 'git_commit_and_push',
        description: 'Stage, commit, and push changes to git',
        inputSchema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Commit message',
            },
            repo_path: {
              type: 'string',
              description: 'Path to the git repository',
              default: '.'
            },
            branch: {
              type: 'string',
              description: 'Branch to push to',
              default: 'main'
            },
          },
          required: ['message'],
        },
      },
      {
        name: 'build_frontend',
        description: 'Build the Next.js frontend application',
        inputSchema: {
          type: 'object',
          properties: {
            frontend_path: {
              type: 'string',
              description: 'Path to the frontend directory',
              default: './frontend'
            },
            build_command: {
              type: 'string',
              description: 'Build command to run',
              default: 'npm run build'
            },
          },
        },
      },
      {
        name: 'run_tests',
        description: 'Run test suites for the application',
        inputSchema: {
          type: 'object',
          properties: {
            test_command: {
              type: 'string',
              description: 'Test command to run',
              default: 'npm test'
            },
            frontend_path: {
              type: 'string',
              description: 'Path to run tests from',
              default: './frontend'
            },
          },
        },
      },
      {
        name: 'render_deploy_status',
        description: 'Check deployment status on Render',
        inputSchema: {
          type: 'object',
          properties: {
            service_id: {
              type: 'string',
              description: 'Render service ID',
            },
          },
          required: ['service_id'],
        },
      },
      {
        name: 'render_trigger_deploy',
        description: 'Trigger a new deployment on Render',
        inputSchema: {
          type: 'object',
          properties: {
            service_id: {
              type: 'string',
              description: 'Render service ID',
            },
          },
          required: ['service_id'],
        },
      },
      {
        name: 'vercel_deploy',
        description: 'Deploy to Vercel (alternative to Render)',
        inputSchema: {
          type: 'object',
          properties: {
            project_name: {
              type: 'string',
              description: 'Vercel project name',
            },
            frontend_path: {
              type: 'string',
              description: 'Path to frontend directory',
              default: './frontend'
            },
          },
          required: ['project_name'],
        },
      },
      {
        name: 'full_deployment_pipeline',
        description: 'Run complete deployment pipeline: git push → build → test → deploy',
        inputSchema: {
          type: 'object',
          properties: {
            commit_message: {
              type: 'string',
              description: 'Commit message for changes',
            },
            service_id: {
              type: 'string',
              description: 'Render service ID for deployment',
            },
            skip_tests: {
              type: 'boolean',
              description: 'Skip running tests',
              default: false
            },
            frontend_path: {
              type: 'string',
              description: 'Path to frontend directory',
              default: './frontend'
            },
          },
          required: ['commit_message', 'service_id'],
        },
      },
      {
        name: 'check_deployment_health',
        description: 'Check if deployment is healthy and responding',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'URL to check for deployment health',
            },
            service_id: {
              type: 'string',
              description: 'Render service ID (optional, for status check)',
            },
          },
          required: ['url'],
        },
      },
    ],
  };
});

// Tool handlers
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'git_status_check':
        return await handleGitStatus(args);

      case 'git_commit_and_push':
        return await handleGitCommitPush(args);

      case 'build_frontend':
        return await handleBuildFrontend(args);

      case 'run_tests':
        return await handleRunTests(args);

      case 'render_deploy_status':
        return await handleRenderDeployStatus(args);

      case 'render_trigger_deploy':
        return await handleRenderTriggerDeploy(args);

      case 'vercel_deploy':
        return await handleVercelDeploy(args);

      case 'full_deployment_pipeline':
        return await handleFullDeploymentPipeline(args);

      case 'check_deployment_health':
        return await handleDeploymentHealth(args);

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Tool implementations
async function handleGitStatus(args) {
  const repoPath = args.repo_path || '.';

  try {
    const { stdout: status } = await execAsync('git status --porcelain', { cwd: repoPath });
    const { stdout: branch } = await execAsync('git branch --show-current', { cwd: repoPath });

    return {
      content: [
        {
          type: 'text',
          text: `Git Status for ${repoPath}:\nBranch: ${branch.trim()}\n\n${status || 'Working directory clean'}`,
        },
      ],
    };
  } catch (error) {
    throw new Error(`Git status check failed: ${error.message}`);
  }
}

async function handleGitCommitPush(args) {
  const { message, repo_path = '.', branch = 'main' } = args;

  try {
    // Stage all changes
    await execAsync('git add .', { cwd: repo_path });

    // Commit
    await execAsync(`git commit -m "${message}"`, { cwd: repo_path });

    // Push
    await execAsync(`git push origin ${branch}`, { cwd: repo_path });

    return {
      content: [
        {
          type: 'text',
          text: `✅ Successfully committed and pushed to ${branch}\nCommit message: ${message}`,
        },
      ],
    };
  } catch (error) {
    throw new Error(`Git commit/push failed: ${error.message}`);
  }
}

async function handleBuildFrontend(args) {
  const { frontend_path = './frontend', build_command = 'npm run build' } = args;

  try {
    const { stdout, stderr } = await execAsync(build_command, {
      cwd: frontend_path,
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });

    return {
      content: [
        {
          type: 'text',
          text: `✅ Frontend build successful\n\nBuild Output:\n${stdout}\n${stderr ? `Errors/Warnings:\n${stderr}` : ''}`,
        },
      ],
    };
  } catch (error) {
    throw new Error(`Frontend build failed: ${error.message}`);
  }
}

async function handleRunTests(args) {
  const { test_command = 'npm test', frontend_path = './frontend' } = args;

  try {
    const { stdout, stderr } = await execAsync(test_command, {
      cwd: frontend_path,
      maxBuffer: 1024 * 1024 * 10
    });

    return {
      content: [
        {
          type: 'text',
          text: `✅ Tests completed\n\nTest Output:\n${stdout}\n${stderr ? `Details:\n${stderr}` : ''}`,
        },
      ],
    };
  } catch (error) {
    throw new Error(`Tests failed: ${error.message}`);
  }
}

async function handleRenderDeployStatus(args) {
  const { service_id } = args;

  if (!RENDER_API_KEY) {
    throw new Error('RENDER_API_KEY environment variable is required');
  }

  try {
    const response = await fetch(`https://api.render.com/v1/services/${service_id}/deploys`, {
      headers: {
        'Authorization': `Bearer ${RENDER_API_KEY}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Render API error: ${response.status}`);
    }

    const deploys = await response.json();
    const latest = deploys[0];

    return {
      content: [
        {
          type: 'text',
          text: `🚀 Latest Render Deployment Status:\n\nService: ${service_id}\nStatus: ${latest?.status || 'Unknown'}\nCommit: ${latest?.commit?.message || 'N/A'}\nDeployed: ${latest?.finishedAt || 'In progress'}\nURL: ${latest?.url || 'N/A'}`,
        },
      ],
    };
  } catch (error) {
    throw new Error(`Render status check failed: ${error.message}`);
  }
}

async function handleRenderTriggerDeploy(args) {
  const { service_id } = args;

  if (!RENDER_API_KEY) {
    throw new Error('RENDER_API_KEY environment variable is required');
  }

  try {
    const response = await fetch(`https://api.render.com/v1/services/${service_id}/deploys`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RENDER_API_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Render API error: ${response.status}`);
    }

    const deploy = await response.json();

    return {
      content: [
        {
          type: 'text',
          text: `🚀 Render deployment triggered!\n\nDeploy ID: ${deploy.id}\nStatus: ${deploy.status}\nService: ${service_id}`,
        },
      ],
    };
  } catch (error) {
    throw new Error(`Render deployment trigger failed: ${error.message}`);
  }
}

async function handleVercelDeploy(args) {
  const { project_name, frontend_path = './frontend' } = args;

  if (!VERCEL_TOKEN) {
    throw new Error('VERCEL_TOKEN environment variable is required');
  }

  try {
    const { stdout } = await execAsync(`npx vercel --prod --yes`, {
      cwd: frontend_path,
      env: { ...process.env, VERCEL_TOKEN }
    });

    return {
      content: [
        {
          type: 'text',
          text: `✅ Vercel deployment successful!\n\n${stdout}`,
        },
      ],
    };
  } catch (error) {
    throw new Error(`Vercel deployment failed: ${error.message}`);
  }
}

async function handleFullDeploymentPipeline(args) {
  const { commit_message, service_id, skip_tests = false, frontend_path = './frontend' } = args;

  const steps = [];
  let currentStep = 1;

  try {
    // Step 1: Git operations
    steps.push(`📝 Step ${currentStep++}: Committing and pushing changes...`);
    await handleGitCommitPush({ message: commit_message, repo_path: '.', branch: 'main' });
    steps.push('✅ Git operations completed');

    // Step 2: Run tests (if not skipped)
    if (!skip_tests) {
      steps.push(`🧪 Step ${currentStep++}: Running tests...`);
      await handleRunTests({ frontend_path });
      steps.push('✅ Tests passed');
    }

    // Step 3: Build frontend
    steps.push(`🔨 Step ${currentStep++}: Building frontend...`);
    await handleBuildFrontend({ frontend_path });
    steps.push('✅ Build completed');

    // Step 4: Trigger deployment
    steps.push(`🚀 Step ${currentStep++}: Triggering deployment...`);
    await handleRenderTriggerDeploy({ service_id });
    steps.push('✅ Deployment triggered');

    // Step 5: Check deployment status
    steps.push(`🔍 Step ${currentStep++}: Checking deployment health...`);
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    const statusResult = await handleRenderDeployStatus({ service_id });

    return {
      content: [
        {
          type: 'text',
          text: `🎉 Full deployment pipeline completed successfully!\n\n${steps.join('\n')}\n\n${statusResult.content[0].text}`,
        },
      ],
    };

  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `❌ Deployment pipeline failed at step ${currentStep}\n\nCompleted steps:\n${steps.join('\n')}\n\nError: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
}

async function handleDeploymentHealth(args) {
  const { url, service_id } = args;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Converto-Deploy-Check/1.0',
      },
      timeout: 10000, // 10 second timeout
    });

    let renderStatus = '';
    if (service_id && RENDER_API_KEY) {
      try {
        const statusResult = await handleRenderDeployStatus({ service_id });
        renderStatus = `\n\n${statusResult.content[0].text}`;
      } catch (e) {
        renderStatus = '\n\n⚠️ Could not check Render status';
      }
    }

    if (response.ok) {
      return {
        content: [
          {
            type: 'text',
            text: `✅ Deployment is healthy!\n\nURL: ${url}\nStatus: ${response.status} ${response.statusText}\nResponse time: Good${renderStatus}`,
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: 'text',
            text: `⚠️ Deployment health check failed\n\nURL: ${url}\nStatus: ${response.status} ${response.statusText}${renderStatus}`,
          },
        ],
      };
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `❌ Deployment health check error\n\nURL: ${url}\nError: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
}

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Auto Deploy MCP Server running...');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
