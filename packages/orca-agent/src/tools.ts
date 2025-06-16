import { Agentica } from "@agentica/core";
import { OpenAI } from "openai";
import { getRedisStore } from './memory';

/**
 * DTO for creating a new agent.
 *
 * Used when the orchestrator (e.g., Orca) wants to create a new functional agent.
 * - `name`: Unique identifier for the agent (should match '@name' in user instruction).
 * - `prompt`: Task description or expertise the agent will handle.
 */
type CreateAgentInput = {
  name: string;
  prompt: string;
};

/**
 * DTO for deleting an agent.
 *
 * Used when the orchestrator wants to remove an agent from memory and Redis.
 */
type DeleteAgentInput = {
  name: string;
};

/**
 * DTO for sending a message to a single agent.
 *
 * Used only when exactly one agent (e.g., "@agent1") is mentioned in the user’s request.
 * Avoid using this when multiple agents are involved; use `multiAgentRoute` instead.
 */
type DirectRouteInput = {
  name: string;
  message: string;
};

/**
 * DTO for executing a coordinated workflow across multiple agents.
 *
 * Required when the user's request references two or more agents (e.g., "@agent1", "@agent2"),
 * or when a sequence of steps involving delegation or chaining is needed.
 */
type MultiAgentRouteParams = {
  agentName: string[];
};

const agentMap = new Map<string, Agentica<"chatgpt">>();

/**
 * Tool class for managing the lifecycle and 1:1 communication of individual AI agents.
 *
 * - Handles creation, deletion, listing, and direct messaging of agents.
 * - Supports targeted, single-agent interactions for isolated tasks or queries.
 * - Stores and retrieves agent prompts from Redis for persistence.
 * 
 * Usage by orchestrator AI (e.g., Orca):
 * - Use `createAgent` and `deleteAgent` to manage agent lifecycle.
 * - Use `directRouteToAgent` only when the user instruction references exactly one agent.
 */
export class AgentLifecycleTool {
  /**
   * Create a new agent with the given name and prompt.
   *
   * Constructs an Agentica agent with a predefined system prompt and registers it in memory and Redis.
   *
   * @param input Agent creation data
   * @returns Name of the created agent (with confirmation)
   */
  async createAgent(input: CreateAgentInput) {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const redis = getRedisStore(process.env.REDIS_URL || 'redis://localhost:6379');
    await redis.connect();

    const systemPrompt = [
      'You are a helpful assistant.',
      'Use the supplied tools to assist the user.',
      '',
      `You are ${input.name}, an agent for the team.`,
      'You respond with precision and only use tools when needed.',
      `User’s task: ${input.prompt}`,
    ].filter(Boolean).join('\n');

    const agent = new Agentica({
      model: "chatgpt",
      vendor: {
        api: openai,
        model: "gpt-4.1-nano",
      },
      controllers: [],
      histories: [],
      config: {
        systemPrompt: {
          initialize: () => systemPrompt,
        },
      },
    });

    agentMap.set(input.name, agent);
    await redis.set(input.name, systemPrompt);
    console.log(`[AgentManagerTool] Created agent "${input.name}"`);
    return input.name + " 생성됨"
  }

  /**
   * Delete an agent by name.
   *
   * Cleans up both the in-memory agent map and the Redis record.
   *
   * @param input Deletion data
   * @returns Name of the deleted agent (with confirmation)
   */
  async deleteAgent(input: DeleteAgentInput) {
    const redis = getRedisStore(process.env.REDIS_URL || 'redis://localhost:6379');
    await redis.connect();

    agentMap.delete(input.name);
    await redis.delete(input.name);
    console.log(`[AgentManager] Deleted agent: ${input.name}`);
    return input.name + " 삭제됨"
  }

  /**
   * Directly message a single agent.
   *
   * This is a one-to-one interaction method used only when the user instruction involves exactly one agent.
   * Do not use this when user input contains multiple '@agent' mentions or implies step chaining.
   *
   * @param input Includes target agent name and message
   * @returns The agent's response
   */
  async directRouteToAgent(input: DirectRouteInput) {
    const agent = agentMap.get(input.name);
    if (!agent) {
      console.log(`[AgentManager] Agent ${input.name} not found`);
      return `[AgentManager] Agent ${input.name} not found`;
    }
    const answers = await agent.conversate(input.message);
    const result = answers.map((answer) => JSON.stringify(answer, null, 2)).join('\n');
    console.log(result);
    return result;
  }

  /**
   * List all currently registered agents.
   *
   * Retrieves agent names and their system prompts from Redis.
   *
   * @returns Formatted string listing all registered agents
   */
  async listAgents() {
    const redis = getRedisStore(process.env.REDIS_URL || 'redis://localhost:6379');
    await redis.connect();

    const agents = await redis.getAll();
    const result = Object.entries(agents).map(([name, prompt]) => `🤖 ${name}: ${prompt}`).join('\n');
    console.log(result);
    return result;
  }
}
/**
 * Tool class for orchestrating workflows across multiple agents.
 *
 * - Designed for multi-step processes where each step may involve a different agent.
 * - Enables structured task routing, coordination, or delegation across agents.
 * - Not intended for direct, single-agent messaging.
 * 
 * Usage by orchestrator AI (e.g., Orca):
 * - Use `multiAgentRoute` when the user request references two or more agents or implies chaining.
 * - Extract all agent mentions and pass them as a list to this method.
 */
export class WorkflowTool {
  /**
   * Execute a multi-agent workflow.
   *
   * This method should be used when the user's request contains multiple agent mentions (e.g., "@agent1", "@agent2")
   * or implies coordination, sequential delegation, or chained logic.
   * The orchestrator (e.g., Orca) must extract all mentioned agents and pass them to this method.
   *
   * @param params Includes a list of agent names participating in the workflow
   * @returns Workflow execution result
   */
  async multiAgentRoute(params: MultiAgentRouteParams): Promise<any> {
    const context: Record<string, any> = {};
    const results: any[] = [];

    for (const step of params.agentName) {
      console.log("🔍 Received step:", step);
    }

    return {
      success: true,
      results,
      context,
    };
  }
}
