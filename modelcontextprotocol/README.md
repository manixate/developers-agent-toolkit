# Mastercard Developers MCP Server

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://developer.mastercard.com/_/_/src/global/assets/svg/mcdev-logo-dark.svg">
  <img src="https://developer.mastercard.com/_/_/src/global/assets/svg/mcdev-logo-light.svg" alt="mastercard developers logo">
</picture>

A Model Context Protocol (MCP) server that provides access to Mastercard Developers documentation.

## Overview

This MCP server acts as a bridge between MCP clients and Mastercard Developers resources, offering tools to:

- List available Mastercard services
- Query API specifications and their operations
- Access documentation for each service
- Retrieve integration guides for OAuth 1.0a and Open Banking

## Prerequisites

- Node.js 18+

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

## Usage

### As a Standalone MCP Server

Start the MCP server:

```bash
npm run start
```

The server runs on stdio and will be available for MCP client connections.

### With Configuration Options

You can pre-configure the server with a specific service or API specification. This is useful when you are working with a specific service, and you want to focus your agents

- `service`: URL of the documentation of a service that you want the MCP to focus on e.g. `https://developer.mastercard.com/mdes-customer-service/documentation`
- `api-specification`: URL of the API specification that you want the MCP tools to focus on e.g. `https://static.developer.mastercard.com/content/match/swagger/match-pro.yaml`. You can get the link from `Download Spec` button in the `API Reference` page of service.
  NOTE: Specifying this will override any value provided in `service` configuration.

```bash
# Pre-configure with a documentation URL
npm run start -- --service=https://developer.mastercard.com/open-banking-us/documentation/

# Pre-configure with an API specification path
npm run start -- --api-specification=https://static.developer.mastercard.com/content/open-banking-us/swagger/openbanking-us.yaml
```

If you specify `service` or `api-specification` then the `get-services-list` tool will be disabled.

### Integration with MCP Clients

To use this server with MCP clients like Claude Desktop, add it to your MCP configuration:

```json
{
  "mcpServers": {
    "mastercard-developers": {
      "command": "npx",
      "args": ["-y", "mastercard-developers-mcp"]
    }
  }
}
```

**Service**

```json
{
  "mcpServers": {
    "mastercard-developers": {
      "command": "npx",
      "args": [
        "-y",
        "mastercard-developers-mcp",
        "--service=https://developer.mastercard.com/open-banking-us/documentation/"
      ]
    }
  }
}
```

**API Specification**

```json
{
  "mcpServers": {
    "mastercard-developers": {
      "command": "npx",
      "args": [
        "-y",
        "mastercard-developers-mcp",
        "--api-specification=https://developer.mastercard.com/open-banking-us/swagger/openbanking-us.yaml"
      ]
    }
  }
}
```

## Available Tools

### Service Discovery

- **`get-services-list`**: Lists all available Mastercard Developers Products and Services with their basic information including title, description, and service ID.

### Documentation

- **`get-documentation`**: Provides an overview of all available documentation for a specific Mastercard service including section titles, descriptions, and navigation links.

- **`get-documentation-section-content`**: Retrieves the complete content for a specific documentation section.

- **`get-documentation-page`**: Retrieves the complete content of a specific documentation page.

### API Operations

- **`get-api-operation-list`**: Provides a summary of all API operations for a specific Mastercard API specification including HTTP methods, request paths, titles, and descriptions.

- **`get-api-operation-details`**: Provides detailed information about a specific API operation including parameter definitions, request and response schemas, and technical specifications for successful API calls.

### Integration Guides

- **`get-oauth10a-integration-guide`**: Retrieves the comprehensive OAuth 1.0a integration guide including step-by-step instructions, code examples, and best practices for Mastercard APIs.

- **`get-openbanking-integration-guide`**: Retrieves the comprehensive Open Banking integration guide including setup instructions, API usage examples, and implementation best practices.

## Development

Watch for changes during development:

```bash
npm run watch
```

Run tests:

```bash
npm run test
```

## References

- [Mastercard Developers Platform](https://developer.mastercard.com/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP SDK](https://github.com/modelcontextprotocol/sdk)
