#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { MastercardDevelopersMCPServer } from 'mastercard-developers-agent-toolkit/mcp';

interface ParsedArgs {
  service?: string;
  apiSpecification?: string;
}

export function parseArgs(args: string[]): ParsedArgs {
  const result: ParsedArgs = {};

  for (const arg of args) {
    if (!arg || !arg.startsWith('--')) {
      continue;
    }

    const [key, value] = arg.split('=', 2);
    if (!key || !value) {
      console.error(`Invalid argument format: ${arg}. Use --key=value format.`);
    }

    const keyName = key.slice(2); // Remove '--'

    if (keyName === 'service') {
      result.service = value;
    } else if (keyName === 'api-specification') {
      result.apiSpecification = value;
    } else {
      console.error(`Unknown argument: ${keyName}`);
    }
  }

  return result;
}

export async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  const config = {
    ...(args.service && { service: args.service }),
    ...(args.apiSpecification && {
      apiSpecification: args.apiSpecification,
    }),
  };

  const server = new MastercardDevelopersMCPServer(config);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('Mastercard Developers MCP Server running on stdio');

  if (args.service) {
    console.error(`Configured Service ID: ${args.service}`);
  }

  if (args.apiSpecification) {
    console.error(`Configured API Specification: ${args.apiSpecification}`);
  }
}

main().catch((error) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(`Fatal error in main(): ${errorMessage}`);
});
