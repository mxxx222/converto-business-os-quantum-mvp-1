#!/usr/bin/env node

/**
 * Notion MCP Server for Cursor
 * Provides tools for automated documentation, task management, and team collaboration
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_API_BASE = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

if (!NOTION_API_KEY) {
  console.error('Error: NOTION_API_KEY environment variable is required');
  process.exit(1);
}

const server = new Server(
  {
    name: 'notion-tools',
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
        name: 'notion_create_page',
        description: 'Create a new Notion page with content',
        inputSchema: {
          type: 'object',
          properties: {
            parent_page_id: {
              type: 'string',
              description: 'Parent page ID (database or page)',
            },
            title: {
              type: 'string',
              description: 'Page title',
            },
            content: {
              type: 'string',
              description: 'Page content (markdown format)',
            },
          },
          required: ['parent_page_id', 'title', 'content'],
        },
      },
      {
        name: 'notion_create_task',
        description: 'Create a task in Notion database',
        inputSchema: {
          type: 'object',
          properties: {
            database_id: {
              type: 'string',
              description: 'Database ID',
            },
            title: {
              type: 'string',
              description: 'Task title',
            },
            status: {
              type: 'string',
              description: 'Task status (Not Started, In Progress, Completed)',
              default: 'Not Started',
            },
            priority: {
              type: 'string',
              description: 'Task priority (Low, Medium, High)',
              default: 'Medium',
            },
            assignee: {
              type: 'string',
              description: 'Assignee name',
            },
          },
          required: ['database_id', 'title'],
        },
      },
      {
        name: 'notion_deployment_log',
        description: 'Log deployment to Notion',
        inputSchema: {
          type: 'object',
          properties: {
            database_id: {
              type: 'string',
              description: 'Deployments database ID',
            },
            service: {
              type: 'string',
              description: 'Service name',
            },
            status: {
              type: 'string',
              description: 'Deployment status (Success, Failed)',
            },
            version: {
              type: 'string',
              description: 'Deployment version',
            },
            notes: {
              type: 'string',
              description: 'Additional notes',
            },
          },
          required: ['database_id', 'service', 'status'],
        },
      },
      {
        name: 'notion_dns_status',
        description: 'Update DNS status in Notion',
        inputSchema: {
          type: 'object',
          properties: {
            database_id: {
              type: 'string',
              description: 'DNS tracking database ID',
            },
            domain: {
              type: 'string',
              description: 'Domain name',
            },
            status: {
              type: 'string',
              description: 'DNS status (Verified, Unverified, Propagating)',
            },
            ssl_status: {
              type: 'string',
              description: 'SSL certificate status',
            },
          },
          required: ['database_id', 'domain', 'status'],
        },
      },
      {
        name: 'notion_daily_report',
        description: 'Create daily report in Notion',
        inputSchema: {
          type: 'object',
          properties: {
            parent_page_id: {
              type: 'string',
              description: 'Reports parent page ID',
            },
            metrics: {
              type: 'object',
              description: 'Daily metrics (signups, uptime, deployments)',
            },
          },
          required: ['parent_page_id', 'metrics'],
        },
      },
      {
        name: 'notion_search',
        description: 'Search Notion pages and databases',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query',
            },
            filter: {
              type: 'string',
              description: 'Filter type (page, database)',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'notion_update_page',
        description: 'Update existing Notion page content',
        inputSchema: {
          type: 'object',
          properties: {
            page_id: {
              type: 'string',
              description: 'Page ID to update',
            },
            content: {
              type: 'string',
              description: 'New content (markdown format)',
            },
          },
          required: ['page_id', 'content'],
        },
      },
      {
        name: 'notion_code_review',
        description: 'Log code review notes in Notion',
        inputSchema: {
          type: 'object',
          properties: {
            database_id: {
              type: 'string',
              description: 'Code reviews database ID',
            },
            file_path: {
              type: 'string',
              description: 'File path',
            },
            feedback: {
              type: 'string',
              description: 'Review feedback',
            },
            reviewer: {
              type: 'string',
              description: 'Reviewer name',
            },
          },
          required: ['database_id', 'file_path', 'feedback'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'notion_create_page':
        return await createPage(args.parent_page_id, args.title, args.content);

      case 'notion_create_task':
        return await createTask(args.database_id, args.title, args.status, args.priority, args.assignee);

      case 'notion_deployment_log':
        return await logDeployment(args.database_id, args.service, args.status, args.version, args.notes);

      case 'notion_dns_status':
        return await updateDNSStatus(args.database_id, args.domain, args.status, args.ssl_status);

      case 'notion_daily_report':
        return await createDailyReport(args.parent_page_id, args.metrics);

      case 'notion_search':
        return await searchNotion(args.query, args.filter);

      case 'notion_update_page':
        return await updatePage(args.page_id, args.content);

      case 'notion_code_review':
        return await logCodeReview(args.database_id, args.file_path, args.feedback, args.reviewer);

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

// Helper functions
async function makeNotionRequest(endpoint, method = 'POST', data = null) {
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION,
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${NOTION_API_BASE}${endpoint}`, options);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Notion API error: ${response.status} - ${error}`);
  }

  return await response.json();
}

async function createPage(parentPageId, title, content) {
  const data = await makeNotionRequest('/pages', 'POST', {
    parent: { page_id: parentPageId },
    properties: {
      title: {
        title: [
          {
            text: {
              content: title,
            },
          },
        ],
      },
    },
    children: [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: content,
              },
            },
          ],
        },
      },
    ],
  });

  return {
    content: [
      {
        type: 'text',
        text: `Page created successfully! ID: ${data.id}\nURL: ${data.url}`,
      },
    ],
  };
}

async function createTask(databaseId, title, status = 'Not Started', priority = 'Medium', assignee = '') {
  const properties = {
    Name: {
      title: [
        {
          text: {
            content: title,
          },
        },
      ],
    },
    Status: {
      select: {
        name: status,
      },
    },
    Priority: {
      select: {
        name: priority,
      },
    },
  };

  if (assignee) {
    properties.Assignee = {
      rich_text: [
        {
          text: {
            content: assignee,
          },
        },
      ],
    };
  }

  const data = await makeNotionRequest('/pages', 'POST', {
    parent: { database_id: databaseId },
    properties,
  });

  return {
    content: [
      {
        type: 'text',
        text: `Task created successfully! ID: ${data.id}`,
      },
    ],
  };
}

async function logDeployment(databaseId, service, status, version = '', notes = '') {
  const properties = {
    Service: {
      title: [
        {
          text: {
            content: service,
          },
        },
      ],
    },
    Status: {
      select: {
        name: status,
      },
    },
    Date: {
      date: {
        start: new Date().toISOString(),
      },
    },
  };

  if (version) {
    properties.Version = {
      rich_text: [
        {
          text: {
            content: version,
          },
        },
      ],
    };
  }

  if (notes) {
    properties.Notes = {
      rich_text: [
        {
          text: {
            content: notes,
          },
        },
      ],
    };
  }

  const data = await makeNotionRequest('/pages', 'POST', {
    parent: { database_id: databaseId },
    properties,
  });

  return {
    content: [
      {
        type: 'text',
        text: `Deployment logged successfully! ID: ${data.id}`,
      },
    ],
  };
}

async function updateDNSStatus(databaseId, domain, status, sslStatus = '') {
  const properties = {
    Domain: {
      title: [
        {
          text: {
            content: domain,
          },
        },
      ],
    },
    Status: {
      select: {
        name: status,
      },
    },
    'Last Updated': {
      date: {
        start: new Date().toISOString(),
      },
    },
  };

  if (sslStatus) {
    properties['SSL Status'] = {
      select: {
        name: sslStatus,
      },
    };
  }

  const data = await makeNotionRequest('/pages', 'POST', {
    parent: { database_id: databaseId },
    properties,
  });

  return {
    content: [
      {
        type: 'text',
        text: `DNS status updated! ID: ${data.id}`,
      },
    ],
  };
}

async function createDailyReport(parentPageId, metrics) {
  const title = `Daily Report - ${new Date().toLocaleDateString()}`;
  const content = Object.entries(metrics)
    .map(([key, value]) => `**${key}:** ${value}`)
    .join('\n');

  return await createPage(parentPageId, title, content);
}

async function searchNotion(query, filter = '') {
  const searchData = {
    query,
  };

  if (filter) {
    searchData.filter = {
      value: filter,
      property: 'object',
    };
  }

  const data = await makeNotionRequest('/search', 'POST', searchData);

  const results = data.results
    .map(result => `${result.id}: ${result.properties?.title?.title?.[0]?.plain_text || 'Untitled'}`)
    .join('\n');

  return {
    content: [
      {
        type: 'text',
        text: results || 'No results found',
      },
    ],
  };
}

async function updatePage(pageId, content) {
  const data = await makeNotionRequest(`/blocks/${pageId}/children`, 'PATCH', {
    children: [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: content,
              },
            },
          ],
        },
      },
    ],
  });

  return {
    content: [
      {
        type: 'text',
        text: `Page updated successfully!`,
      },
    ],
  };
}

async function logCodeReview(databaseId, filePath, feedback, reviewer = '') {
  const properties = {
    'File Path': {
      title: [
        {
          text: {
            content: filePath,
          },
        },
      ],
    },
    Feedback: {
      rich_text: [
        {
          text: {
            content: feedback,
          },
        },
      ],
    },
    Date: {
      date: {
        start: new Date().toISOString(),
      },
    },
  };

  if (reviewer) {
    properties.Reviewer = {
      rich_text: [
        {
          text: {
            content: reviewer,
          },
        },
      ],
    };
  }

  const data = await makeNotionRequest('/pages', 'POST', {
    parent: { database_id: databaseId },
    properties,
  });

  return {
    content: [
      {
        type: 'text',
        text: `Code review logged! ID: ${data.id}`,
      },
    ],
  };
}

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Notion MCP Server running on stdio');
}

main().catch(console.error);
