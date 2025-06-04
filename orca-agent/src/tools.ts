export class AgentManagerTool {
  createAgent(input: { name: string }) {
    console.log(`[AgentManager] Created agent: ${input.name}`);
  }

  deleteAgent(input: { name: string }) {
    console.log(`[AgentManager] Deleted agent: ${input.name}`);
  }

  routeToAgent(input: { name: string; message: string }) {
    console.log(`[AgentManager] Routed message to agent ${input.name}: ${input.message}`);
  }

  listAgents() {
    console.log(`[AgentManager] Listing all agents...`);
  }
}
