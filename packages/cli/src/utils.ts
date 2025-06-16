export function getAgentDescription(agentName: string): string {
    const descriptions = {
      "orca": "AI agent for orchestration",
      "orca-api-server": "Direct API server call"
    } as { [key: string]: string };
    return descriptions[agentName] || "AI conversational agent";
  }