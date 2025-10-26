#!/usr/bin/env node

/**
 * Vercel MCP Server
 * Provides direct deployment and log access to Vercel
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fetch from 'node-fetch';

const VERCEL_API_BASE = 'https://api.vercel.com';
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

class VercelMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'vercel-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'vercel_deploy',
          description: 'Deploy a project to Vercel',
          inputSchema: {
            type: 'object',
            properties: {
              projectId: {
                type: 'string',
                description: 'Vercel project ID',
              },
              gitRef: {
                type: 'string',
                description: 'Git reference (branch, commit, tag)',
                default: 'main',
              },
            },
            required: ['projectId'],
          },
        },
        {
          name: 'vercel_get_deployment',
          description: 'Get deployment status and details',
          inputSchema: {
            type: 'object',
            properties: {
              deploymentId: {
                type: 'string',
                description: 'Vercel deployment ID',
              },
            },
            required: ['deploymentId'],
          },
        },
        {
          name: 'vercel_get_logs',
          description: 'Get deployment logs',
          inputSchema: {
            type: 'object',
            properties: {
              deploymentId: {
                type: 'string',
                description: 'Vercel deployment ID',
              },
              limit: {
                type: 'number',
                description: 'Number of log lines to fetch',
                default: 100,
              },
            },
            required: ['deploymentId'],
          },
        },
        {
          name: 'vercel_list_projects',
          description: 'List all Vercel projects',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'vercel_get_project',
          description: 'Get project details',
          inputSchema: {
            type: 'object',
            properties: {
              projectId: {
                type: 'string',
                description: 'Vercel project ID',
              },
            },
            required: ['projectId'],
          },
        },
        {
          name: 'vercel_create_project',
          description: 'Create a new Vercel project from Git repository',
          inputSchema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Project name',
              },
              gitRepository: {
                type: 'string',
                description: 'Git repository URL',
              },
              framework: {
                type: 'string',
                description: 'Framework (nextjs, react, vue, etc.)',
                default: 'nextjs',
              },
              rootDirectory: {
                type: 'string',
                description: 'Root directory for the project',
                default: '.',
              },
              buildCommand: {
                type: 'string',
                description: 'Build command',
                default: 'npm run build',
              },
              outputDirectory: {
                type: 'string',
                description: 'Output directory',
                default: '.next',
              },
            },
            required: ['name', 'gitRepository'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'vercel_deploy':
            return await this.deployProject(args);
          case 'vercel_get_deployment':
            return await this.getDeployment(args);
          case 'vercel_get_logs':
            return await this.getLogs(args);
          case 'vercel_list_projects':
            return await this.listProjects();
          case 'vercel_get_project':
            return await this.getProject(args);
          case 'vercel_create_project':
            return await this.createProject(args);
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
        };
      }
    });
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${VERCEL_API_BASE}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Vercel API error: ${response.status} - ${error}`);
    }

    return await response.json();
  }

  async deployProject({ projectId, gitRef = 'main' }) {
    const result = await this.makeRequest('/v13/deployments', {
      method: 'POST',
      body: JSON.stringify({
        name: projectId,
        gitSource: {
          type: 'github',
          ref: gitRef,
        },
        target: 'production',
      }),
    });

    return {
      content: [
        {
          type: 'text',
          text: `Deployment started: ${result.url}\nDeployment ID: ${result.id}\nStatus: ${result.readyState}`,
        },
      ],
    };
  }

  async getDeployment({ deploymentId }) {
    const result = await this.makeRequest(`/v13/deployments/${deploymentId}`);

    return {
      content: [
        {
          type: 'text',
          text: `Deployment Status: ${result.readyState}\nURL: ${result.url}\nCreated: ${result.createdAt}\nBuild Time: ${result.buildTimeAt}`,
        },
      ],
    };
  }

  async getLogs({ deploymentId, limit = 100 }) {
    const result = await this.makeRequest(`/v2/deployments/${deploymentId}/events?limit=${limit}`);

    const logs = result.map(log => `${log.timestamp} [${log.type}] ${log.payload}`).join('\n');

    return {
      content: [
        {
          type: 'text',
          text: `Deployment Logs (${result.length} entries):\n${logs}`,
        },
      ],
    };
  }

  async listProjects() {
    const result = await this.makeRequest('/v9/projects');

    const projects = result.projects.map(project => ({
      id: project.id,
      name: project.name,
      framework: project.framework,
      url: project.targets?.production?.url,
    }));

    return {
      content: [
        {
          type: 'text',
          text: `Projects (${projects.length}):\n${projects.map(p => `- ${p.name} (${p.id}) - ${p.url || 'No URL'}`).join('\n')}`,
        },
      ],
    };
  }

  async getProject({ projectId }) {
    const result = await this.makeRequest(`/v9/projects/${projectId}`);

    return {
      content: [
        {
          type: 'text',
          text: `Project: ${result.name}\nFramework: ${result.framework}\nURL: ${result.targets?.production?.url}\nCreated: ${result.createdAt}`,
        },
      ],
    };
  }

  async createProject({ name, gitRepository, framework = 'nextjs', rootDirectory = '.', buildCommand = 'npm run build', outputDirectory = '.next' }) {
    const result = await this.makeRequest('/v10/projects', {
      method: 'POST',
      body: JSON.stringify({
        name,
        gitRepository,
        framework,
        rootDirectory,
        buildCommand,
        outputDirectory,
      }),
    });

    return {
      content: [
        {
          type: 'text',
          text: `Project created: ${result.name}\nProject ID: ${result.id}\nFramework: ${result.framework}\nRepository: ${result.gitRepository}`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Vercel MCP server running on stdio');
  }
}

const server = new VercelMCPServer();
server.run().catch(console.error);
