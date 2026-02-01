import { app, arg, InvocationContext } from "@azure/functions";
import { v4 as uuidv4 } from "uuid";
import { MOCK_MEMBERS, IN_MEMORY_CONTRIBUTIONS } from "./contributionData";

// Constants
const ADD_CONTRIBUTION_TOOL_NAME = "add_contribution";
const ADD_CONTRIBUTION_TOOL_DESCRIPTION = "Add a new contribution to the project using the specified required fields.";

// Add Contribution Tool Handler
async function addContributionHandler(_toolArguments: unknown, context: InvocationContext): Promise<string> {
  const args = context.triggerMetadata.mcptoolargs as {
    MemberId?: string;
    ProjectId?: string;
    Summary?: string;
    Description?: string;
    AttachmentUrl?: string;
  };

  // Validate required fields
  const missing: string[] = [];
  if (!args.MemberId) missing.push("MemberId");
  if (!args.ProjectId) missing.push("ProjectId");
  if (!args.Summary) missing.push("Summary");
  if (!args.Description) missing.push("Description");
  if (!args.AttachmentUrl) missing.push("AttachmentUrl");

  if (missing.length) {
    return JSON.stringify({ error: `Missing required fields: ${missing.join(", ")}` });
  }

  // Lookup member
  const member = MOCK_MEMBERS.find((m) => m.member_id === args.MemberId);

  // Create contribution
  const contribution = {
    id: uuidv4(),
    project_id: args.ProjectId,
    author_name: member ? member.full_name : args.MemberId,
    member_id: member ? member.member_id : args.MemberId,
    message: args.Description,
    contribution_title: args.Summary,
    attachmentUrl: args.AttachmentUrl,
    receivedAt: new Date().toISOString(),
  };

  IN_MEMORY_CONTRIBUTIONS.push(contribution);

  const baseUrl = process.env.MCP_HTTP_BASE_URL || "http://localhost:3000";
  const createdContributionLink = `${baseUrl.replace(/\/$/, "")}/contributions/${contribution.id}`;

  return JSON.stringify({
    status: "success",
    message: "Contribution added successfully",
    verified_member: !!member,
    contribution,
    createdContributionLink,
    known_members_sample: MOCK_MEMBERS.slice(0, 3),
  });
}

// Register Add Contribution Tool
app.mcpTool("addContribution", {
  toolName: ADD_CONTRIBUTION_TOOL_NAME,
  description: ADD_CONTRIBUTION_TOOL_DESCRIPTION,
  toolProperties: {
    MemberId: arg.string().describe("Canonical member id (required)"),
    ProjectId: arg.string().describe("Canonical project id (required)"),
    Summary: arg.string().describe("Short summary/title (required)"),
    Description: arg.string().describe("Full description (required)"),
    AttachmentUrl: arg.string().describe("Attachment URL (required)"),
  },
  handler: addContributionHandler,
});
