import { app, arg, InvocationContext } from "@azure/functions";
import { IN_MEMORY_CONTRIBUTIONS } from "./contributionData";

// Constants
const GET_CONTRIBUTIONS_TOOL_NAME = "get_contributions";
const GET_CONTRIBUTIONS_TOOL_DESCRIPTION = "Return contributions (mock/in-memory)";

// Get Contributions Tool Handler
async function getContributionsHandler(_toolArguments: unknown, context: InvocationContext): Promise<string> {
  const args = context.triggerMetadata.mcptoolargs as {
    project_name?: string;
    author_name?: string;
  };

  let contributions = IN_MEMORY_CONTRIBUTIONS;

  if (args.project_name) {
    contributions = contributions.filter(
      (c) => c.project_id.toLowerCase() === args.project_name!.toLowerCase()
    );
  }

  if (args.author_name) {
    contributions = contributions.filter(
      (c) => c.author_name.toLowerCase() === args.author_name!.toLowerCase()
    );
  }

  return JSON.stringify({
    status: "success",
    count: contributions.length,
    filters: {
      project_name: args.project_name || "none",
      author_name: args.author_name || "none",
    },
    contributions,
  });
}

// Register Get Contributions Tool
app.mcpTool("getContributions", {
  toolName: GET_CONTRIBUTIONS_TOOL_NAME,
  description: GET_CONTRIBUTIONS_TOOL_DESCRIPTION,
  toolProperties: {
    project_name: arg.string().describe("Filter by project name").optional(),
    author_name: arg.string().describe("Filter by author name").optional(),
  },
  handler: getContributionsHandler,
});
