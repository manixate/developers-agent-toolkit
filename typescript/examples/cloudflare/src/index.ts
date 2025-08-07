import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { tools } from "../../../src/shared/tools";

export class MastercardDevelopersRemoteMCP extends McpAgent {
	server = new McpServer({
		name: "MastercardDevelopersRemoteMCP",
		version: "0.1.0",
	});

	async init() {
		const availableTools = tools({});
		availableTools.forEach((tool) => {
			this.server.tool(
				tool.method,
				tool.description,
				tool.parameters.shape,
				async (params: any) => {
					try {
						const result = await tool.execute(params);
						return { content: [{ type: "text" as const, text: result }] };
					} catch (error) {
						const message =
							error instanceof Error ? error.message : String(error);
						return {
							content: [
								{ type: "text" as const, text: message, isError: true },
							],
						};
					}
				},
			);
		});
	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			return MastercardDevelopersRemoteMCP.serveSSE("/sse").fetch(
				request,
				env,
				ctx,
			);
		}

		if (url.pathname === "/mcp") {
			return MastercardDevelopersRemoteMCP.serve("/mcp").fetch(
				request,
				env,
				ctx,
			);
		}

		return new Response("Not found", { status: 404 });
	},
};
