# Mastercard Developers Agent Toolkit

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://developer.mastercard.com/_/_/src/global/assets/svg/mcdev-logo-dark.svg">
  <img src="https://developer.mastercard.com/_/_/src/global/assets/svg/mcdev-logo-light.svg" alt="mastercard developers logo">
</picture>

The Mastercard Developers Agent Toolkit allows popular agent frameworks (currently Model Context Protocol - MCP) to integrate with [Mastercard Developers Platform](https://developer.mastercard.com) for service discovery and integration guides.

## Model Context Protocol

### Installation

If you want to use the package in your project, you can install it using npm:

```bash
npm install --save mastercard-developers-agent-toolkit
```

Requirements
- Node 18+

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