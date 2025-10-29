#!/usr/bin/env node

/**
 * OpenAI MCP Server for Cursor
 * Provides tools for OpenAI API interactions, code analysis, and AI assistance
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_BASE = process.env.OPENAI_API_BASE || 'https://api.openai.com/v1';
const OPENAI_ORG = process.env.OPENAI_ORG || process.env.OPENAI_ORGANIZATION || undefined;
const OPENAI_PROJECT = process.env.OPENAI_PROJECT || undefined;

if (!OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY environment variable is required');
  process.exit(1);
}

const server = new Server(
  {
    name: 'openai-tools',
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
        name: 'openai_chat_completion',
        description: 'Generate chat completion using OpenAI GPT models',
        inputSchema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'The message to send to the AI',
            },
            model: {
              type: 'string',
              description: 'Model to use (gpt-4o, gpt-4o-mini, gpt-3.5-turbo)',
              default: 'gpt-4o-mini',
            },
            max_tokens: {
              type: 'number',
              description: 'Maximum tokens to generate',
              default: 2000,
            },
            temperature: {
              type: 'number',
              description: 'Temperature for randomness (0.0-2.0)',
              default: 0.7,
            },
          },
          required: ['message'],
        },
      },
      {
        name: 'openai_health',
        description: 'Check OpenAI API connectivity and model availability',
        inputSchema: {
          type: 'object',
          properties: {
            model: { type: 'string', default: 'gpt-4o-mini' },
          },
        },
      },
      {
        name: 'openai_code_analysis',
        description: 'Analyze code and provide suggestions for improvements',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'Code to analyze',
            },
            language: {
              type: 'string',
              description: 'Programming language',
              default: 'javascript',
            },
            focus: {
              type: 'string',
              description: 'Focus area (performance, security, readability, best-practices)',
              default: 'best-practices',
            },
          },
          required: ['code'],
        },
      },
      {
        name: 'openai_explain_code',
        description: 'Explain complex code in simple terms',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'Code to explain',
            },
            language: {
              type: 'string',
              description: 'Programming language',
              default: 'javascript',
            },
            detail_level: {
              type: 'string',
              description: 'Detail level (simple, intermediate, advanced)',
              default: 'intermediate',
            },
          },
          required: ['code'],
        },
      },
      {
        name: 'openai_generate_tests',
        description: 'Generate unit tests for code',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'Code to generate tests for',
            },
            language: {
              type: 'string',
              description: 'Programming language',
              default: 'javascript',
            },
            test_framework: {
              type: 'string',
              description: 'Test framework to use',
              default: 'jest',
            },
          },
          required: ['code'],
        },
      },
      {
        name: 'openai_optimize_code',
        description: 'Optimize code for performance and efficiency',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'Code to optimize',
            },
            language: {
              type: 'string',
              description: 'Programming language',
              default: 'javascript',
            },
            optimization_type: {
              type: 'string',
              description: 'Type of optimization (performance, memory, readability)',
              default: 'performance',
            },
          },
          required: ['code'],
        },
      },
      {
        name: 'openai_documentation',
        description: 'Generate troubleshooting documentation and guides',
        inputSchema: {
          type: 'object',
          properties: {
            topic: {
              type: 'string',
              description: 'Topic to create documentation for',
            },
            format: {
              type: 'string',
              description: 'Documentation format (markdown, html, plain)',
              default: 'markdown',
            },
            audience: {
              type: 'string',
              description: 'Target audience (beginner, intermediate, advanced)',
              default: 'intermediate',
            },
          },
          required: ['topic'],
        },
      },
      {
        name: 'openai_troubleshoot',
        description: 'Troubleshoot errors and provide solutions',
        inputSchema: {
          type: 'object',
          properties: {
            error_message: {
              type: 'string',
              description: 'Error message to troubleshoot',
            },
            context: {
              type: 'string',
              description: 'Additional context about the error',
            },
            language: {
              type: 'string',
              description: 'Programming language',
              default: 'javascript',
            },
          },
          required: ['error_message'],
        },
      },
      {
        name: 'openai_architecture_advice',
        description: 'Provide architecture and design advice',
        inputSchema: {
          type: 'object',
          properties: {
            description: {
              type: 'string',
              description: 'Description of the system or feature',
            },
            constraints: {
              type: 'string',
              description: 'Constraints and requirements',
            },
            scale: {
              type: 'string',
              description: 'Expected scale (small, medium, large, enterprise)',
              default: 'medium',
            },
          },
          required: ['description'],
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
      case 'openai_chat_completion':
        return await chatCompletion(args.message, args.model, args.max_tokens, args.temperature);
      case 'openai_health':
        return await openaiHealth(args?.model);

      case 'openai_code_analysis':
        return await analyzeCode(args.code, args.language, args.focus);

      case 'openai_explain_code':
        return await explainCode(args.code, args.language, args.detail_level);

      case 'openai_generate_tests':
        return await generateTests(args.code, args.language, args.test_framework);

      case 'openai_optimize_code':
        return await optimizeCode(args.code, args.language, args.optimization_type);

      case 'openai_documentation':
        return await generateDocumentation(args.topic, args.format, args.audience);

      case 'openai_troubleshoot':
        return await troubleshoot(args.error_message, args.context, args.language);

      case 'openai_architecture_advice':
        return await architectureAdvice(args.description, args.constraints, args.scale);

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

async function openaiHealth(model = 'gpt-4o-mini') {
  try {
    const data = await makeOpenAIRequest('/chat/completions', {
      model,
      messages: [{ role: 'user', content: 'ping' }],
      max_tokens: 1,
      temperature: 0,
    });
    return {
      content: [
        { type: 'text', text: `ok model=${model}, id=${data.id || 'n/a'}` },
      ],
    };
  } catch (e) {
    return {
      content: [
        { type: 'text', text: `health_failed: ${e.message}` },
      ],
    };
  }
}

// Helper functions
async function makeOpenAIRequest(endpoint, data) {
  const response = await fetch(`${OPENAI_API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
      ...(OPENAI_ORG ? { 'OpenAI-Organization': OPENAI_ORG } : {}),
      ...(OPENAI_PROJECT ? { 'OpenAI-Project': OPENAI_PROJECT } : {}),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errText = `${response.status} ${response.statusText}`;
    try {
      const j = await response.json();
      errText += `: ${j.error?.message || JSON.stringify(j)}`;
    } catch {}
    throw new Error(`OpenAI API error: ${errText}`);
  }

  return await response.json();
}

async function chatCompletion(message, model = 'gpt-4o-mini', maxTokens = 2000, temperature = 0.7) {
  const data = await makeOpenAIRequest('/chat/completions', {
    model,
    messages: [
      {
        role: 'system',
        content: 'You are an expert software engineer helping with the Converto Business OS project. Provide clear, actionable advice.'
      },
      {
        role: 'user',
        content: message
      }
    ],
    max_tokens: maxTokens,
    temperature,
  });

  return {
    content: [
      {
        type: 'text',
        text: data.choices[0].message.content,
      },
    ],
  };
}

async function analyzeCode(code, language = 'javascript', focus = 'best-practices') {
  const prompt = `Analyze this ${language} code and provide suggestions for improvement focusing on ${focus}:

\`\`\`${language}
${code}
\`\`\`

Provide:
1. Code quality assessment
2. Specific improvement suggestions
3. Best practices recommendations
4. Potential issues or bugs`;

  return await chatCompletion(prompt, 'gpt-4o-mini', 3000, 0.3);
}

async function explainCode(code, language = 'javascript', detailLevel = 'intermediate') {
  const prompt = `Explain this ${language} code in ${detailLevel} detail:

\`\`\`${language}
${code}
\`\`\`

Provide a clear, step-by-step explanation that a ${detailLevel} developer can understand.`;

  return await chatCompletion(prompt, 'gpt-4o-mini', 2500, 0.5);
}

async function generateTests(code, language = 'javascript', testFramework = 'jest') {
  const prompt = `Generate comprehensive ${testFramework} tests for this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Include:
1. Unit tests for all functions
2. Edge cases
3. Error handling tests
4. Integration tests if applicable`;

  return await chatCompletion(prompt, 'gpt-4o-mini', 4000, 0.3);
}

async function optimizeCode(code, language = 'javascript', optimizationType = 'performance') {
  const prompt = `Optimize this ${language} code for ${optimizationType}:

\`\`\`${language}
${code}
\`\`\`

Provide:
1. Optimized version of the code
2. Explanation of optimizations
3. Performance improvements
4. Trade-offs if any`;

  return await chatCompletion(prompt, 'gpt-4o-mini', 3500, 0.3);
}

async function generateDocumentation(topic, format = 'markdown', audience = 'intermediate') {
  const prompt = `Create comprehensive ${format} documentation for: ${topic}

Target audience: ${audience} developers

Include:
1. Overview and introduction
2. Prerequisites
3. Step-by-step instructions
4. Code examples
5. Troubleshooting section
6. Best practices`;

  return await chatCompletion(prompt, 'gpt-4o-mini', 5000, 0.4);
}

async function troubleshoot(errorMessage, context = '', language = 'javascript') {
  const prompt = `Troubleshoot this ${language} error:

Error: ${errorMessage}
Context: ${context}

Provide:
1. Root cause analysis
2. Step-by-step solution
3. Prevention strategies
4. Related common issues`;

  return await chatCompletion(prompt, 'gpt-4o-mini', 2500, 0.3);
}

async function architectureAdvice(description, constraints = '', scale = 'medium') {
  const prompt = `Provide architecture advice for:

Description: ${description}
Constraints: ${constraints}
Scale: ${scale}

Include:
1. Recommended architecture patterns
2. Technology stack suggestions
3. Scalability considerations
4. Implementation roadmap
5. Potential challenges`;

  return await chatCompletion(prompt, 'gpt-4o-mini', 4000, 0.5);
}

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('OpenAI MCP Server running on stdio');
}

main().catch(console.error);
