import { Agentica } from "@agentica/core";
import { OpenAI } from "openai";
import { AgentManagerTool } from "./tools";
import typia from "typia";
import readline from "readline";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const agent = new Agentica({
    model: "chatgpt",
    vendor: {
      model: "gpt-4.1-nano",
      api: openai,
    },
    controllers: [
      {
        name: "Agent Manager Tool",
        protocol: "class",
        application: typia.llm.application<AgentManagerTool, "chatgpt">(),
        execute: new AgentManagerTool(),
      },
    ],
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const conversation = () => {
    rl.question("User Input (exit: q) : ", async (input) => {
      if (input === "q") {
        rl.close();
        return;
      }

      const answers = await agent.conversate(input);

      answers.forEach((answer) => {
        console.log(JSON.stringify(answer, null, 2));
      });

      conversation();
    });
  };

  conversation();
}

main().catch(console.error);
