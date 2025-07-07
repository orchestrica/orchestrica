import { WebSocketConnector, Driver } from "tgrid";
import {
  IAgenticaRpcService,
  IAgenticaRpcListener,
} from "@agentica/rpc";
import readline from "readline";

export async function createConnector(): Promise<WebSocketConnector<null, IAgenticaRpcListener, IAgenticaRpcService<"chatgpt">>> {
  const connector = new WebSocketConnector(null, {
    text: async (evt: any) => {
      console.log(evt.role, evt.text);
    },
    select: async (evt: any) => {
      const selections = evt.selection || [];
      const names = selections.map((s: any) => s.name || "(unnamed)").join(", ");
      console.log(`[select] ${selections.length} selected: ${names}`);
    },
    execute: async (evt: any) => {
      console.log("");
      console.log("🟡 User Request:");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("Operation");
      console.log(`  Protocol  : ${evt.operation?.protocol}`);
      console.log(`  Controller: ${evt.operation?.controller}`);
      console.log(`  Function  : ${evt.operation?.function}`);
      console.log("");
      console.log("Arguments");
      for (const [key, value] of Object.entries(evt.arguments || {})) {
        console.log(`  ${key}: ${typeof value === "object" ? JSON.stringify(value) : value}`);
      }
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🟢 Result:");
      if (evt.value !== undefined) {
        console.log("");
        console.log("Value");
        console.log(typeof evt.value === "object" ? JSON.stringify(evt.value, null, 2) : String(evt.value));
      }
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    },
    describe: async (evt: { text: string }) => {
      console.log(`🐬 Orca response:`);
      const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
      const printWithTyping = async (text: string) => {
        for (const char of text) {
          process.stdout.write(char);
          await delay(5);
        }
        process.stdout.write("\n");
      };
      const lines = evt.text.split("\n").filter(Boolean);
      for (const line of lines) {
        await printWithTyping(`  ${line.trim()}`);
      }
    },
    assistantMessage: async (evt: any) => {
      if (evt.text) {
        console.log(`🤖 Assistant: ${evt.text}`);
      }
    },
  });

  await connector.connect("ws://localhost:3001");
  return connector;
}

export async function startAgentSession(agentName: string, service: Driver<IAgenticaRpcService<"chatgpt">>) {
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