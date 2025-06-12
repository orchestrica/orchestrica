"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAgentDescription = getAgentDescription;
function getAgentDescription(agentName) {
    const descriptions = {
        "orca": "AI agent for orchestration",
        "orca-mcp-server": "Direct MCP server call agent"
    };
    return descriptions[agentName] || "AI conversational agent";
}
