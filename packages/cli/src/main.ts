import readline from "readline";
import inquirer from "inquirer";
import { WebSocketConnector, Driver } from "tgrid";
import {
  IAgenticaRpcService,
  IAgenticaRpcListener,
} from "@agentica/rpc";


async function createConnector(): Promise<WebSocketConnector<null, IAgenticaRpcListener, IAgenticaRpcService<"chatgpt">>> {
  const connector = new WebSocketConnector(null, {
    print: async (evt: { role: string; text: string }) => {
      console.log(evt.role, evt.text);
    },
    select: async (evt: any) => {
      console.log("selector", JSON.stringify(evt.selection, null, 2));
    },
    execute: async (evt: any) => {
      console.log("execute", JSON.stringify(evt.operation, null, 2), evt.arguments, evt.value);
    },
    describe: async (evt: { text: string }) => {
      console.log("describer", evt.text);
    },
    assistantMessage: async (evt: any) => {
      console.log("assistantMessage:", JSON.stringify(evt, null, 2));
    },
  });
  await connector.connect("ws://localhost:3001");
  return connector;
}


async function selectAgentMenu(agents: string[]): Promise<string | null> {
  console.clear();
  const result = await inquirer.prompt([
    {
      type: "list",
      name: "agent",
      message: "Select an agent to interact with:",
      choices: [
        { name: "🐋 Orca", value: "Orca" },
        ...agents.filter((a) => a !== "Orca"),
        new inquirer.Separator(),
        "Exit",
      ],
    },
  ]);
  return result.agent === "Exit" ? null : result.agent;
}

async function startAgentSession(agentName: string, service: Driver<IAgenticaRpcService<"chatgpt">>) {
  console.clear();
  const sessionRl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let sessionInterrupted = false;
  let resolvePrompt: ((value: string) => void) | null = null;

  sessionRl.on("SIGINT", () => {
    sessionInterrupted = true;
    if (resolvePrompt) resolvePrompt("");
  });

  const prompt = (question: string): Promise<string> =>
    new Promise((resolve) => {
      resolvePrompt = resolve;
      sessionRl.question(question, (answer) => {
        resolvePrompt = null;
        resolve(answer);
      });
    });

  console.log(`[${agentName}] Connected. Type your prompt or Ctrl+C to return to Main:`);

  while (true) {
    if (sessionInterrupted) break;
    const input = await prompt(`${agentName} > `);
    if (sessionInterrupted) break;
    if (input.trim().toLowerCase() === "exit") {
      console.log(`🔙 Returning to Orca main menu from ${agentName}`);
      break;
    }

    try {
      const response = await service.conversate(input);
      if (Array.isArray(response)) {
        console.log(`${agentName} >>`, response.map((r: any) => r.content).join("\n"));
      }
    } catch (err) {
      console.error("❌ Error:", err);
    }
  }

  sessionRl.close();
}

async function main() {
  const connector = await createConnector();
  const service = connector.getDriver();

  const agents = ["Orca", "Agent1", "Agent2", "Agent3"];

  while (true) {
    const agentName = await selectAgentMenu(agents);
    if (!agentName) {
      console.log("👋 Exiting Orca CLI...");
      connector.close();
      break;
    }
    await startAgentSession(agentName, service);
  }
}

main().catch(console.error);