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

function getAgentDescription(agentName: string): string {
  const descriptions = {
    "orca": "AI agent for orchestration",
    "orca-mcp-server": "Direct MCP server call agent"
  } as { [key: string]: string };
  return descriptions[agentName] || "AI conversational agent";
}

async function selectAgentMenu(agents: string[]): Promise<string | null> {
  console.clear();
  const result = await inquirer.prompt([
    {
      type: "list",
      name: "agent",
      message: "Select an agent to interact with:",
      choices: [
        ...agents.map(agent => ({
          name: agent.padEnd(25) + " - " + getAgentDescription(agent),
          value: agent,
          short: agent
        })),
        new inquirer.Separator(),
        "Exit",
      ],
    },
  ]);
  return result.agent === "Exit" ? null : result.agent;
}

async function handleMcpServerMode(service: Driver<IAgenticaRpcService<"chatgpt">>) {
  while (true) {
    try {
      console.clear();
      const apiExamples = [
        "Get User Profile",
        "Create New Task", 
        "Update Task Status",
        "Delete Task",
        "List All Projects"
      ];

      const result = await inquirer.prompt([{
        type: "list",
        name: "api",
        message: "Select API example (Ctrl+C to go back):",
        choices: [...apiExamples, new inquirer.Separator(), "Back to Main Menu"]
      }]).catch(() => {
        throw new Error("INTERRUPTED");
      });
      
      if (result.api === "Back to Main Menu") {
        break;
      }

      console.log(`Selected API: ${result.api}`);
      
      await new Promise<void>((resolve) => {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });
        rl.question('\nPress Enter to continue...', () => {
          rl.close();
          resolve();
        });
      });
      
    } catch (err) {
      console.log("\n🔙 Returning to main menu...");
      break;
    }
  }
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

  const agents = ["orca", "orca-mcp-server"];

  while (true) {
    const agentName = await selectAgentMenu(agents);
    if (!agentName) {
      console.log("👋 Exiting Orca CLI...");
      connector.close();
      break;
    }
    
    if (agentName === "orca-mcp-server") {
      await handleMcpServerMode(service);
    } else {
      await startAgentSession(agentName, service);
    }
  }
}

main().catch(console.error);