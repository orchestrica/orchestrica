import { Agentica, assertHttpController } from "@agentica/core";
import { AgentLifecycleTool, WorkflowTool } from "./tools";
import { AgenticaRpcService, IAgenticaRpcListener, IAgenticaRpcService } from "@agentica/rpc";
import { Driver, WebSocketServer } from "tgrid";
import {ORCA_SYSTEM_PROMPT} from './systemPrompt'
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
          name: "orca:agent.lifecycle",
          protocol: "class",
          application: typia.llm.application<AgentLifecycleTool, "chatgpt">(),
          execute: new AgentLifecycleTool(),
        },
        {
          name: "orca:agent.workflow",
          protocol: "class",
          application: typia.llm.application<WorkflowTool, "chatgpt">(),
          execute: new WorkflowTool(),
        },
          // functions from Swagger/OpenAPI
          assertHttpController({
            name: "orca:backend.crud",
            model: "chatgpt",
            document: await fetch(
              "http://localhost:8080/openapi.json",
            ).then(r => r.json()),
            connection: {
              host: "http://localhost:8080",
            },
          }),
      ],
      config: {
        systemPrompt: {
          initialize: () => ORCA_SYSTEM_PROMPT,
        },
      },
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
