# Mastercard Developers Agent Toolkit

The Mastercard Developers Agent Toolkit allows popular agent frameworks (currently Model Context Protocol - MCP) to integrate with [Mastercard Developers Platform](https://developer.mastercard.com) for service discovery and integration guides.

## Model Context Protocol

### Installation

```bash
npm install mastercard-developers-agent-toolkit
```

Requirements
- Node 18+

For example:

```javascript
import { MastercardDevelopersMCPServer } from "mastercard-developers-agent-toolkit/mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new MastercardDevelopersMCPServer({});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Mastercard Developers MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
```

For more details, checkout `typescript` directory