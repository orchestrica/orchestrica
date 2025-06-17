import { Agentica, IAgenticaHistoryJson } from "@agentica/core";
import { getRedisStore } from './memory';

/**
 * WorkflowTool - Agentic AI Function Orchestrator
 *
 * This class is designed to work with @agentica's LLM Function Calling strategy.
 * @agentica automatically converts your exported methods into function-callable schemas
 * and provides validation feedback by using typia-based runtime validators.
 *
 * Agents created via `createAgent()` become callable LLM functions.
 * Functions like `multiAgentRoute`, `directRoute` are designed to be automatically selected
 * and invoked by the LLM through structured function calling.
 *
 * LLM Function Calling (see: https://platform.openai.com/docs/guides/function-calling):
 * - LLM parses user conversation and selects the best-matching function
 * - Agentica registers methods as ILlmFunction and validates arguments using typia
 * - Validation feedback loop lets LLM retry incorrect calls with corrected arguments
 *
 * Strategy:
 * - Selector: decides which method to invoke
 * - Caller: performs function calling with argument filling
 * - Describer: explains the result
 */

/**
 * DTO for creating a new agent.
 *
 * Used by the LLM function calling engine to instantiate new task-specific agents.
 * This DTO is function-callable and receives arguments directly from the LLM model.
 */
type CreateAgentInput = {
  templateNname: string;
};


/**
 * DTO for save an agent.
 *
 */
type SaveAgentInput = {
  name: string;
};

/**
 * DTO for load an agent.
 *
 */
type LoadAgentInput = {
  name: string;
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
import { selectTemplate } from "./template";

export class WorkflowTool {
  /**
   * Execute a coordinated workflow across multiple agents.
   *
   * This method is selected when user's input involves collaboration or chaining between agents.
   * It is a high-level function entry point used by selector/caller agent.
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
      message: "Multi-agent workflow executed",
      results,
      context,
    };
  }

  /**
   * Create an agent from a template using the given name and store it in memory.
   *
   * Supported agent templates: "notion", "analyst", and "default".
   * If the provided name does not match any of the above, the "default" template is used as fallback.
   *
   * @param input Contains the name (unique identifier) and prompt used to initialize the agent.
   */
  async createAgent(input: CreateAgentInput): Promise<any> {
    console.log(`[createAgent] Creating agent "${input.templateNname}"`);
    const agent = await selectTemplate(input.templateNname, []);
    agentMap.set(input.templateNname, agent);
    console.log(`[createAgent] Agent "${input.templateNname}" created and stored in memory`);
    return {
      success: true,
      message: `Agent "${input.templateNname}" created`,
    };
  }

  /**
   * Save the agent's template name and chat history to Redis.
   *
   * This method is exposed to LLM as a callable function.
   * Called after a conversation to persist state.
   *
   * @param input Contains the name of the agent to persist
   */
  async saveAgent(input: SaveAgentInput): Promise<any> {
    const redis = getRedisStore(process.env.REDIS_URL || 'redis://localhost:6379');
    await redis.connect();

    const agent = agentMap.get(input.name);
    if (!agent) throw new Error(`Agent ${input.name} not found`);

    const data = {
      template: input.name,
      history: agent.getHistories(),
      // Optionally, you can also store the prompt if available in agent or input
      // prompt: agent.prompt,
    };

    await redis.set(`agent:${input.name}`, JSON.stringify(data));
    console.log(`[WorkflowTool] Saved agent "${input.name}"`);
    return {
      success: true,
      message: `Agent "${input.name}" saved`,
    };
  }

  /**
   * Load the agent with template and history from Redis into memory.
   *
   * Callable by LLM before invoking other methods, to restore stateful agents.
   *
   * @param input Contains the name of the agent to restore
   */
  async loadAgent(input: LoadAgentInput): Promise<any> {
    const redis = getRedisStore(process.env.REDIS_URL || 'redis://localhost:6379');
    await redis.connect();

    const raw = await redis.get(`agent:${input.name}`);
    if (!raw) {
      console.warn(`No agent found in Redis for ${input.name}`);
      return {
        success: false,
        message: `Agent "${input.name}" not found in Redis`,
      };
    }

    const parsed = JSON.parse(raw);
    const agent = await selectTemplate(parsed.template, parsed.history);
    agentMap.set(input.name, agent);
    console.log(`[WorkflowTool] Loaded agent "${input.name}"`);
    return {
      success: true,
      message: `Agent "${input.name}" loaded`,
    };
  }

  /**
   * List all agents currently stored in Redis.
   *
   * Returns formatted list of agent names and their saved template names or prompts.
   */
  async listAgents(): Promise<any> {
    const redis = getRedisStore(process.env.REDIS_URL || 'redis://localhost:6379');
    await redis.connect();

    const agents = await redis.getAll();
    const result = Object.entries(agents).map(([name, value]) => {
      try {
        const parsed = JSON.parse(value as string);
        const historyStr = Array.isArray(parsed.history)
          ? parsed.history.map((h: IAgenticaHistoryJson) => JSON.stringify(h)).join(", ")
          : String(parsed.history);
        return `🤖 ${name}: ${parsed.template} ${historyStr}`;
      } catch {
        return `🤖 ${name}`;
      }
    }).join('\n');

    console.log(result);
    return {
      success: true,
      message: "List of agents",
      agents: result,
    };
  }

  /**
   * Send a direct message to a single agent.
   *
   * This is a core LLM function. Selector agent chooses this when user mentions only one agent.
   *
   * @param input Includes the agent name and the message to send
   * @returns Agent response
   */
  async directRoute(input: DirectRouteInput): Promise<any> {
    let agent = agentMap.get(input.name);
    if (!agent) {
      await this.loadAgent({ name: input.name });
      agent = agentMap.get(input.name);
      if (!agent) {
        throw new Error(`Agent "${input.name}" could not be loaded from Redis.`);
      }
    }
    const result = await agent.conversate(input.message);
    return {
      success: true,
      prompt: input.message,
      message: `Agent "${input.name}" replied`,
      reply: result,
    };
  }
}