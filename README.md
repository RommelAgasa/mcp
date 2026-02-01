<!--
---
name: Remote MCP with Azure Functions (Node.js/TypeScript/JavaScript)
description: Run a remote MCP server on Azure functions.  
languages:
- typescript
- javascript
- nodejs
- bicep
- azdeveloper
products:
- azure-functions
- azure
- azure-ai-foundry
page_type: sample
urlFragment: remote-mcp-functions-typescript
---
-->
# Contribution Tracking MCP Server - Azure Functions

This project demonstrates a production-ready remote MCP (Model Context Protocol) server deployed on Azure Functions. It provides tools for managing project contributions, integrated with Azure AI Foundry for seamless AI model collaboration. 

The server runs locally with full debugging support and deploys to Azure in minutes using `azd up`. It's secured by design with HTTPs and system key authentication, with additional options for OAuth via EasyAuth and API Management. 

**Watch the video overview**

<a href="https://www.youtube.com/watch?v=U9DsLcP5vEk">
  <img src="./images/video-overview.png" alt="Watch the video" width="500" />
</a>

If you're looking for this sample in more languages check out the [.NET/C#](https://github.com/Azure-Samples/remote-mcp-functions-dotnet) and [Python](https://github.com/Azure-Samples/remote-mcp-functions-python) versions.

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/remote-mcp-functions-typescript)

Below is the architecture diagram for the Remote MCP Server using Azure Functions:

![Architecture Diagram](architecture-diagram.png)

## Prerequisites

+ [Node.js](https://nodejs.org/en/download/) version 18 or higher
+ [Azure Functions Core Tools](https://learn.microsoft.com/azure/azure-functions/functions-run-local?pivots=programming-language-javascript#install-the-azure-functions-core-tools) >= `4.0.7030`
+ [Azure Developer CLI](https://aka.ms/azd)
+ [Visual Studio Code](https://code.visualstudio.com/) (recommended)
  + [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
  + [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) (optional, for testing with Copilot Chat)

## Prepare your local environment

1. Clone or navigate to your project directory
2. Install dependencies:
   ```shell
   npm install
   ```

## Available MCP Tools

This MCP server provides three tools for managing project contributions:

- **`list_projects`** - Enumerate all projects with contribution counts and team member information
- **`get_contributions`** - Filter and retrieve contributions by project name or team member
- **`add_contribution`** - Record a new contribution with project, member, summary, and optional attachments

## Run your MCP Server locally from the terminal

1. Install dependencies (if not already done)
   ```shell
   npm install
   ```

2. Build the project
   ```shell
   npm run build
   ```

3. Start the Functions host locally:
   ```shell
   func start
   ```

The local MCP endpoint will be available at: `http://0.0.0.0:7071/runtime/webhooks/mcp`

> **Note**: In Azure, the endpoint includes authentication: `/runtime/webhooks/mcp?code=<system_key>`

## Test the MCP Server locally

### Using MCP Inspector

1. In a **new terminal window**, install and run MCP Inspector

    ```shell
    npx @modelcontextprotocol/inspector node build/index.js
    ```

2. CTRL+Click the displayed URL (typically `http://0.0.0.0:5173/#resources`) to open MCP Inspector
3. Set the transport type to `http` 
4. Set the URL to your local MCP endpoint:
    ```
    http://0.0.0.0:7071/runtime/webhooks/mcp
    ```
5. Click **Connect** and then **List Tools** to see all available tools
6. Test each tool by clicking it and providing sample parameters:
   - **list_projects** - No parameters needed, returns all projects
   - **get_contributions** - Optional: filter by `project_name` or `author_name`
   - **add_contribution** - Required: `MemberId`, `ProjectId`, `Summary`, `Description`; Optional: `AttachmentUrl`

When finished, press `Ctrl+C` in both terminal windows to stop the processes.

### Using VS Code GitHub Copilot

1. Start the Functions host locally (as shown above)
2. In VS Code, open the Chat panel with GitHub Copilot
3. Ask Copilot to use the MCP tools:
   ```
   List all the projects we have
   ```
   ```
   Show me all contributions from Marcus Thorne
   ```
   ```
   Add a new contribution to the Sorsogon Community Innovation Labs project
   ```
4. When prompted, click **Continue** to allow the tool execution
5. Copilot will execute the MCP tool and display the results

## Deploy to Azure for Remote MCP

Optionally, enable VNet for additional network isolation before deployment:

```bash
azd env set VNET_ENABLED true
```

Run these [azd](https://aka.ms/azd) commands to provision Azure resources and deploy your code:

```shell
azd provision
```

Wait a few minutes for access permissions to take effect, then deploy:

```shell
azd deploy
```

This will:
- Create an Azure Function App with your MCP server
- Set up all required infrastructure (App Service plan, Storage, etc.)
- Deploy your TypeScript code to Azure
- Configure the MCP system key for secure access

> **Note** [API Management](https://aka.ms/mcp-remote-apim-auth) and [App Service built-in authentication](https://learn.microsoft.com/en-us/azure/app-service/overview-authentication-authorization) can be used for enhanced security and OAuth provider integration.  

## Get your MCP System Key

After `azd deploy` completes, you need the MCP system key to authenticate requests. 

### Option 1: Get from Azure CLI (Recommended)

```shell
# Get your function app name from azd
FUNCTION_APP_NAME=$(azd env get-values | grep AZURE_FUNCTION_APP_NAME | cut -d'=' -f2)
RESOURCE_GROUP=$(azd env get-values | grep AZURE_RESOURCE_GROUP | cut -d'=' -f2)

# Retrieve the mcp_extension system key
MCP_KEY=$(az functionapp keys list \
  --resource-group $RESOURCE_GROUP \
  --name $FUNCTION_APP_NAME \
  --query "systemKeys.mcp_extension" -o tsv)

echo "MCP Extension Key: $MCP_KEY"
```

### Option 2: Get from Azure Portal

1. Go to [Azure Portal](https://portal.azure.com/)
2. Search for your Function App (name from `azd env get-values`)
3. Navigate to **Functions** → **App Keys** 
4. Copy the `mcp_extension` key from the **System Keys** section

## Connect to your *remote* MCP server in Azure

After deployment, your MCP server is accessible at:
```
https://<funcappname>.azurewebsites.net/runtime/webhooks/mcp?code=<your-mcp-extension-system-key>
```

**Example with actual values:**
```
https://mcp-scil-aegccgcze5bsdkez.azurewebsites.net/runtime/webhooks/mcp?code=X9kL2mN5pQ8rT3vW6xY1zA4bC7dE0fG9hI2jK5mL8nO1pR4sT7uV0wX3yZ6aB9cD==
```

### Test in MCP Inspector

Use the key in the URL:
```
https://<funcappname>.azurewebsites.net/runtime/webhooks/mcp?code=<your-mcp-extension-system-key>
```

### Connect in Azure AI Foundry

1. Go to [Azure AI Foundry](https://ai.azure.com/)
2. Create or open your AI project
3. Navigate to **Tools** → **MCP Servers**
4. Add your remote MCP server with:
   - **URL**: `https://<funcappname>.azurewebsites.net/runtime/webhooks/mcp`
   - **Headers**: `x-functions-key: <your-mcp-extension-system-key>`
5. Your AI models can now call the `list_projects`, `get_contributions`, and `add_contribution` tools

#### Configure Agent with Context

To help your AI agent understand how to use the MCP tools effectively:

1. Create a new **Agent** in your project
2. In the **Configuration** panel, set:
   - **Display name**: "Contribution Manager"
   - **Description**: 
     ```
     A contribution tracking assistant that helps manage project contributions 
     across the Sorsogon Community Innovation Labs ecosystem. I can help you:
     - List all available projects and see who's contributing
     - Search for specific contributions by project or team member
     - Record new contributions with details like summary, description, and attachments
     
     Use me to track community engagement, project progress, and team member activities.
     ```
   - **Starter prompts** (optional examples):
     1. "List all projects and show me the contribution counts"
     2. "Show me all contributions from Marcus Thorne"
     3. "Add a new contribution to the Sorsogon Community Innovation Labs project"

3. Enable the MCP tools in your agent's **Tools** configuration
4. Test the agent with your starter prompts

### Connect in VS Code GitHub Copilot

Set up in your `mcp.json`:

```json
{
    "inputs": [
        {
            "type": "promptString",
            "id": "functions-mcp-extension-system-key",
            "description": "Azure Functions MCP Extension System Key",
            "password": true
        },
        {
            "type": "promptString",
            "id": "functionapp-name",
            "description": "Azure Function App Name"
        }
    ],
    "servers": {
        "remote-mcp-function": {
            "type": "http",
            "url": "https://${input:functionapp-name}.azurewebsites.net/runtime/webhooks/mcp",
            "headers": {
                "x-functions-key": "${input:functions-mcp-extension-system-key}"
            }
        }
    }
}
```

## Redeploy your code updates

After making changes to your MCP tools or handlers, rebuild and redeploy:

```shell
npm run build
azd deploy
```

> **Note**: Your function app code is always updated with the latest deployment package. No manual file replacement needed.

## Clean up resources

When you're done working with your function app and related resources, you can use this command to delete the function app and its related resources from Azure and avoid incurring any further costs:

```shell
azd down
```

## Source Code Structure

The MCP server is organized with Azure Functions' native decorator pattern:

```
src/
├── index.ts                 # Entry point - imports all tools
├── functions/
│   ├── data/
│   │   └── contributionData.ts    # Shared mock data (projects, contributions, members)
│   └── tools/
│       ├── listProjectsTool.ts    # list_projects MCP tool handler
│       ├── addContributionTool.ts # add_contribution MCP tool handler
│       └── getContributionsTool.ts# get_contributions MCP tool handler
```

## Next Steps

- **Enhance Functionality**: Add more tools for project management or analytics
- **Persist Data**: Replace in-memory mock data with a database (Cosmos DB, SQL, etc.)
- **Add Security**: Enable [Azure API Management](https://aka.ms/mcp-remote-apim-auth) or [App Service authentication](https://learn.microsoft.com/en-us/azure/app-service/overview-authentication-authorization)
- **Enable VNet**: Use `azd env set VNET_ENABLED true` for network isolation
- **Monitor & Log**: Check Azure Application Insights for tool usage patterns
- **Scale**: Optimize performance with higher tier App Service plans
- **Learn more**: Explore [MCP documentation](https://modelcontextprotocol.io) and [Azure Functions with MCP](https://learn.microsoft.com/en-us/azure/azure-functions/functions-mcp)

