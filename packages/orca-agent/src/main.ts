import { Agentica } from "@agentica/core";
import { AgentManagerTool } from "./tools";
import { AgenticaRpcService, IAgenticaRpcListener, IAgenticaRpcService } from "@agentica/rpc";
import { Driver, WebSocketServer } from "tgrid";
import typia from "typia";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const server: WebSocketServer<
    null,
    IAgenticaRpcService<"chatgpt">,
    IAgenticaRpcListener
  > = new WebSocketServer();
  console.log("🟢 Server is starting on ws://localhost:3001");

  await server.open(3001, async (acceptor) => {
    const openai = new (await import("openai")).default({
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

    const listener: Driver<IAgenticaRpcListener> = acceptor.getDriver();
    const service: AgenticaRpcService<"chatgpt"> = new AgenticaRpcService({
      agent,
      listener,
    });

    await acceptor.accept(service);
    console.log("WebSocket server ready at ws://localhost:3001");
  });
}

main().catch(console.error);
