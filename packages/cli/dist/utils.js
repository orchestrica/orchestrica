"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAgentDescription = getAgentDescription;
function getAgentDescription(agentName) {
    const descriptions = {
        "orca": "AI agent for orchestration",
        "orca-api-server": "Direct API server call"
    };
    return descriptions[agentName] || "AI conversational agent";
}
