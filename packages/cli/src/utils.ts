export function getAgentDescription(agentName: string): string {
    const descriptions = {
      "orca": "AI agent for orchestration",
      "orca-mcp-server": "Direct MCP server call agent"
    } as { [key: string]: string };
    return descriptions[agentName] || "AI conversational agent";
  }