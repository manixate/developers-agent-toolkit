# Mastercard Agent Toolkit - TypeScript

The Mastercard Developers Agent Toolkit allows popular agent frameworks (currently Model Context Protocol - MCP) to integrate with [Mastercard Developers Platform](https://developer.mastercard.com) for service discovery and integration guides.

## Installation

```bash
npm install --save mastercard-developers-agent-toolkit
```

### Requirements

- Node 18+

## Usage

You can optionally specify `service` or `apiSpecification` as part of the configuration.

- `service`: URL of the documentation of a service that you want the MCP to focus on e.g. `https://developer.mastercard.com/mdes-customer-service/documentation`
- `apiSpecification`: URL of the API specification that you want the MCP tools to focus on e.g. `https://static.developer.mastercard.com/content/match/swagger/match-pro.yaml`. You can get the link from `Download Spec` button in the `API Reference` page of service. 
NOTE: This will override any value provided in `service` configuration.

```typescript
import { MastercardDevelopersMCPServer } from 'mastercard-developers-agent-toolkit/mcp';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new MastercardDevelopersMCPServer({
  configuration: {
    service: 'https://developer.mastercard.com/open-banking-us/documentation',
  },
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Mastercard Developers MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
```

## References

- [Mastercard Developers Platform](https://developer.mastercard.com/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP SDK](https://github.com/modelcontextprotocol/sdk)
