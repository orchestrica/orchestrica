import { Agentica } from "@agentica/core";
import { OpenAI } from "openai";
import { getRedisStore } from './memory';

const agentMap = new Map<string, Agentica<"chatgpt">>();

export class AgentLifecycleTool {
  async createAgent(input: { name: string; prompt: string }) {
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

  async deleteAgent(input: { name: string }) {
    const redis = getRedisStore(process.env.REDIS_URL || 'redis://localhost:6379');
    await redis.connect();

    agentMap.delete(input.name);
    await redis.delete(input.name);
    console.log(`[AgentManager] Deleted agent: ${input.name}`);
    return input.name + " 삭제됨"
  }

  async directRouteToAgent(input: { name: string; message: string }) {
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

  async listAgents() {
    const redis = getRedisStore(process.env.REDIS_URL || 'redis://localhost:6379');
    await redis.connect();

    const agents = await redis.getAll();
    const result = Object.entries(agents).map(([name, prompt]) => `🤖 ${name}: ${prompt}`).join('\n');
    console.log(result);
    return result;
  }
}
export class WorkflowTool {
  async multiAgentRoute(params: { agentName: string[] }): Promise<any> {
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
