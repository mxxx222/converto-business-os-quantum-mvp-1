#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');

class GitHubMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'github-tools',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'github_create_issue',
            description: 'Create a new GitHub issue',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner (username or organization)',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
                title: {
                  type: 'string',
                  description: 'Issue title',
                },
                body: {
                  type: 'string',
                  description: 'Issue body/description',
                },
                labels: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Issue labels',
                },
                assignees: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Issue assignees (usernames)',
                },
                token: {
                  type: 'string',
                  description: 'GitHub personal access token',
                },
              },
              required: ['owner', 'repo', 'title', 'token'],
            },
          },
          {
            name: 'github_create_pr',
            description: 'Create a new GitHub pull request',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
                title: {
                  type: 'string',
                  description: 'PR title',
                },
                body: {
                  type: 'string',
                  description: 'PR description',
                },
                head: {
                  type: 'string',
                  description: 'Source branch name',
                },
                base: {
                  type: 'string',
                  description: 'Target branch name (default: main)',
                  default: 'main',
                },
                token: {
                  type: 'string',
                  description: 'GitHub personal access token',
                },
              },
              required: ['owner', 'repo', 'title', 'head', 'token'],
            },
          },
          {
            name: 'github_list_issues',
            description: 'List GitHub issues for a repository',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
                state: {
                  type: 'string',
                  enum: ['open', 'closed', 'all'],
                  description: 'Issue state filter',
                  default: 'open',
                },
                labels: {
                  type: 'string',
                  description: 'Comma-separated list of labels to filter by',
                },
                token: {
                  type: 'string',
                  description: 'GitHub personal access token',
                },
              },
              required: ['owner', 'repo', 'token'],
            },
          },
          {
            name: 'github_get_repo',
            description: 'Get repository information',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
                token: {
                  type: 'string',
                  description: 'GitHub personal access token',
                },
              },
              required: ['owner', 'repo', 'token'],
            },
          },
          {
            name: 'github_create_release',
            description: 'Create a new GitHub release',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
                tag_name: {
                  type: 'string',
                  description: 'Release tag name (e.g., v1.0.0)',
                },
                name: {
                  type: 'string',
                  description: 'Release name',
                },
                body: {
                  type: 'string',
                  description: 'Release description',
                },
                draft: {
                  type: 'boolean',
                  description: 'Whether this is a draft release',
                  default: false,
                },
                prerelease: {
                  type: 'boolean',
                  description: 'Whether this is a prerelease',
                  default: false,
                },
                token: {
                  type: 'string',
                  description: 'GitHub personal access token',
                },
              },
              required: ['owner', 'repo', 'tag_name', 'token'],
            },
          },
          {
            name: 'github_trigger_workflow',
            description: 'Trigger a GitHub Actions workflow',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
                workflow_id: {
                  type: 'string',
                  description: 'Workflow ID or filename',
                },
                ref: {
                  type: 'string',
                  description: 'Branch or commit SHA to trigger on',
                  default: 'main',
                },
                inputs: {
                  type: 'object',
                  description: 'Workflow inputs (key-value pairs)',
                },
                token: {
                  type: 'string',
                  description: 'GitHub personal access token',
                },
              },
              required: ['owner', 'repo', 'workflow_id', 'token'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'github_create_issue':
            return await this.createIssue(args);
          case 'github_create_pr':
            return await this.createPullRequest(args);
          case 'github_list_issues':
            return await this.listIssues(args);
          case 'github_get_repo':
            return await this.getRepository(args);
          case 'github_create_release':
            return await this.createRelease(args);
          case 'github_trigger_workflow':
            return await this.triggerWorkflow(args);
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

  async createIssue(args) {
    const { owner, repo, title, body = '', labels = [], assignees = [], token } = args;

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        title,
        body,
        labels,
        assignees,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`GitHub API error: ${result.message || 'Unknown error'}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: `Issue created successfully!\n\nTitle: ${result.title}\nNumber: #${result.number}\nURL: ${result.html_url}\nState: ${result.state}`,
        },
      ],
    };
  }

  async createPullRequest(args) {
    const { owner, repo, title, body = '', head, base = 'main', token } = args;

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        title,
        body,
        head,
        base,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`GitHub API error: ${result.message || 'Unknown error'}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: `Pull request created successfully!\n\nTitle: ${result.title}\nNumber: #${result.number}\nURL: ${result.html_url}\nState: ${result.state}\nFrom: ${result.head.ref} → ${result.base.ref}`,
        },
      ],
    };
  }

  async listIssues(args) {
    const { owner, repo, state = 'open', labels = '', token } = args;

    const params = new URLSearchParams({ state });
    if (labels) params.append('labels', labels);

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`GitHub API error: ${result.message || 'Unknown error'}`);
    }

    let issuesList = `Found ${result.length} ${state} issues:\n\n`;
    result.forEach((issue, index) => {
      issuesList += `${index + 1}. #${issue.number}: ${issue.title}\n`;
      issuesList += `   State: ${issue.state}\n`;
      issuesList += `   Created: ${new Date(issue.created_at).toLocaleDateString()}\n`;
      issuesList += `   URL: ${issue.html_url}\n`;
      if (issue.labels.length > 0) {
        issuesList += `   Labels: ${issue.labels.map(l => l.name).join(', ')}\n`;
      }
      issuesList += '\n';
    });

    return {
      content: [
        {
          type: 'text',
          text: issuesList,
        },
      ],
    };
  }

  async getRepository(args) {
    const { owner, repo, token } = args;

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`GitHub API error: ${result.message || 'Unknown error'}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: `Repository Information:\n\nName: ${result.full_name}\nDescription: ${result.description || 'No description'}\nStars: ${result.stargazers_count}\nForks: ${result.forks_count}\nLanguage: ${result.language || 'Unknown'}\nDefault Branch: ${result.default_branch}\nURL: ${result.html_url}\nClone URL: ${result.clone_url}`,
        },
      ],
    };
  }

  async createRelease(args) {
    const { owner, repo, tag_name, name, body = '', draft = false, prerelease = false, token } = args;

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        tag_name,
        name: name || tag_name,
        body,
        draft,
        prerelease,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`GitHub API error: ${result.message || 'Unknown error'}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: `Release created successfully!\n\nTag: ${result.tag_name}\nName: ${result.name}\nDraft: ${result.draft}\nPrerelease: ${result.prerelease}\nURL: ${result.html_url}`,
        },
      ],
    };
  }

  async triggerWorkflow(args) {
    const { owner, repo, workflow_id, ref = 'main', inputs = {}, token } = args;

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow_id}/dispatches`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        ref,
        inputs,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`GitHub API error: ${error.message || 'Unknown error'}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: `Workflow triggered successfully!\n\nWorkflow: ${workflow_id}\nBranch: ${ref}\nInputs: ${JSON.stringify(inputs, null, 2)}`,
        },
      ],
    };
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('GitHub MCP server running on stdio');
  }
}

const server = new GitHubMCPServer();
server.run().catch(console.error);
