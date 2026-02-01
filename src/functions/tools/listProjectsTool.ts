import { app, arg, InvocationContext } from "@azure/functions";
import { IN_MEMORY_CONTRIBUTIONS } from "../data/contributionData";

// Constants
const LIST_PROJECTS_TOOL_NAME = "list_projects";
const LIST_PROJECTS_TOOL_DESCRIPTION = "List all available projects in Sorsogon Community Innovation Labs (SCIL)";

// List Projects Tool Handler
async function listProjectsHandler(_toolArguments: unknown, context: InvocationContext): Promise<string> {
  // Get unique project IDs from contributions
  const projectSet = new Set<string>();
  IN_MEMORY_CONTRIBUTIONS.forEach((c) => {
    projectSet.add(c.project_id);
  });

  const projects = Array.from(projectSet).sort();

  // Get summary for each project
  const projectSummary = projects.map((projectId) => {
    const projectContributions = IN_MEMORY_CONTRIBUTIONS.filter(
      (c) => c.project_id === projectId
    );
    return {
      project_name: projectId,
      contribution_count: projectContributions.length,
      contributors: Array.from(
        new Set(projectContributions.map((c) => c.author_name))
      ),
    };
  });

  return JSON.stringify({
    status: "success",
    total_projects: projects.length,
    projects: projectSummary,
  });
}

// Register List Projects Tool
app.mcpTool("listProjects", {
  toolName: LIST_PROJECTS_TOOL_NAME,
  description: LIST_PROJECTS_TOOL_DESCRIPTION,
  toolProperties: {},
  handler: listProjectsHandler,
});
