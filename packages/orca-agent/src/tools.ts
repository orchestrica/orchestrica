import { Agentica, IAgenticaHistoryJson } from "@agentica/core";
import { getRedisStore } from './memory';
import puppeteer from "puppeteer";

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
 * DTO for executing a hierarchical workflow with parent-child task delegation.
 *
 * Selected when the user implies a tree structure, where one agent's output
 * feeds into multiple dependent agents. Common phrases: "based on", "children of", "use the result of".
 *
 * Example input:
 * {
 *   tree: {
 *     agent: "summarizer",
 *     children: [
 *       { agent: "translator" },
 *       { agent: "analyzer" }
 *     ]
 *   }
 * }
 */
type HierarchicalWorkflowInput = {
  tree: {
    /** Root agent in the hierarchy (executed first) */
    agent: string;
    /** Agents that process the output of the root agent */
    children?: Array<{ agent: string }>;
  };
};

/**
 * DTO for executing a sequential workflow involving multiple agents.
 *
 * Selected when the user asks to run tasks one after another in order,
 * using keywords like "step-by-step", "then", "after that", or "sequentially".
 *
 * Example input:
 * {
 *   steps: [
 *     { agent: "summarizer" },
 *     { agent: "translator" }
 *   ]
 * }
 */
type SequentialWorkflowInput = {
  steps: Array<{
    /** Name of the agent to invoke at this step */
    agent: string;
  }>;
};

/**
 * DTO for executing a parallel workflow where agents run concurrently.
 *
 * Selected when the user asks to perform multiple tasks at the same time,
 * using expressions like "run in parallel", "at once", or "simultaneously".
 *
 * Example input:
 * {
 *   agents: ["summarizer", "translator"]
 * }
 */
type ParallelWorkflowInput = {
  /** Names of agents to run concurrently */
  agents: string[];
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
   * Create an agent from a template using the given name and store it in memory.
   *
   * Supported agent templates: "web", "notion", "analyst", and "default".
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
   * Delete an agent from memory and Redis.
   *
   * This function is used to completely remove an agent's state and template reference.
   * Typically invoked when an agent is no longer needed.
   *
   * @param input Contains the name of the agent to delete
   * @returns Result of deletion operation
   */
  async deleteAgent(input: DeleteAgentInput): Promise<any> {
    const redis = getRedisStore(process.env.REDIS_URL || 'redis://localhost:6379');
    await redis.connect();

    agentMap.delete(input.name);
    await redis.delete(`agent:${input.name}`);
    console.log(`[WorkflowTool] Deleted agent "${input.name}"`);
    return {
      success: true,
      message: `Agent "${input.name}" deleted`,
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

  /**
   * Execute a Hierarchical Workflow.
   *
   * This function is selected when the user describes a task tree structure,
   * with one parent agent and children that depend on its result.
   *
   * Example input:
   * {
   *   tree: {
   *     agent: "summarizer",
   *     children: [
   *       { agent: "translator" },
   *       { agent: "analyzer" }
   *     ]
   *   }
   * }
   *
   * @param input HierarchicalWorkflowInput - A tree of agent relationships.
   * @returns Execution result
   */
  async hierarchicalWorkflow(input: HierarchicalWorkflowInput): Promise<any> {
  console.log("[hierarchicalWorkflow] Received input:", JSON.stringify(input, null, 2));
  // You can recursively traverse the tree and execute children after parent
  return {
    success: true,
    message: "Hierarchical Workflow executed",
    input,
  };
  }

  /**
   * Execute a Parallel Processing Workflow.
   *
   * This function is selected when the user wants to run multiple agents concurrently.
   *
   * Example input:
   * {
   *   agents: ["summarizer", "translator"]
   * }
   *
   * @param input ParallelWorkflowInput - A list of agents to run in parallel.
   * @returns Execution result
   */
  async parallelWorkflow(input: ParallelWorkflowInput): Promise<any> {
    console.log("[parallelWorkflow] Received input:", JSON.stringify(input, null, 2));
    // You could parallelize tasks here
    return {
      success: true,
      message: "Parallel Processing Workflow executed",
      input,
    };
  }

  /**
   * Execute a Sequential Workflow.
   *
   * This function is selected when the user wants agents to be executed
   * step-by-step in the given order.
   *
   * Example input:
   * {
   *   steps: [
   *     { agent: "summarizer" },
   *     { agent: "translator" }
   *   ]
   * }
   *
   * @param input SequentialWorkflowInput - An array of agents to execute in sequence.
   * @returns Execution result
   */
  async sequentialWorkflow(input: SequentialWorkflowInput): Promise<any> {
    console.log("[sequentialWorkflow] Received input:", JSON.stringify(input, null, 2));
    // You can iterate and invoke agents here in order
    return {
      success: true,
      message: "Sequential Workflow executed",
      input,
    };
  }
}

export class WebBrowserTool {
  /**
   * Launch a headless browser using Puppeteer and open the given URL.
   *
   * @param params Contains the URL to open in a browser
   * @returns Success result or error message
   */
  async openUrlInBrowser(params: { url: string }): Promise<any> {
    try {
      const browser = await puppeteer.launch({
        headless: false, // Use true if you want headless
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();
      await page.goto(params.url, { waitUntil: "networkidle2" });
      return {
        success: true,
        message: `URL "${params.url}" opened successfully.`,
      };
    } catch (error: any) {
      console.error("[WebBrowserTool] Failed to open URL:", error);
      return {
        success: false,
        message: `Failed to open URL: ${error.message || error}`,
      };
    }
  }
}