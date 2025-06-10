import { Agentica } from "@agentica/core";
import { OpenAI } from "openai";

const agentMap = new Map<string, Agentica<"chatgpt">>();

export class AgentManagerTool {
  createAgent(input: { name: string; prompt: string }) {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
    console.log(`[AgentManagerTool] Created agent "${input.name}"`);
  }

  deleteAgent(input: { name: string }) {
    agentMap.delete(input.name);
    console.log(`[AgentManager] Deleted agent: ${input.name}`);
  }

  async routeToAgent(input: { name: string; message: string }) {
    const agent = agentMap.get(input.name);
    if (!agent) {
      console.error(`[AgentManager] Agent ${input.name} not found`);
      return;
    }
    const answers = await agent.conversate(input.message);
    answers.forEach((answer) => {
      console.log(input.name, JSON.stringify(answer, null, 2));
    });
  }

  listAgents() {
    console.log(`[AgentManager] Listing all agents:`);
    for (const name of agentMap.keys()) {
      console.log(`- ${name}`);
    }
  }
}
