import { Agentica } from "@agentica/core";
import { WorkflowTool } from "./tools";
import { AgenticaRpcService, IAgenticaRpcListener, IAgenticaRpcService } from "@agentica/rpc";
import { Driver, WebSocketServer } from "tgrid";
import {
  COMMON_SYSTEM_PROMPT_EN,
  INITIALIZE_SYSTEM_PROMPT_EN,
  SELECT_SYSTEM_PROMPT_EN,
  EXECUTE_SYSTEM_PROMPT_EN,
  DESCRIBE_SYSTEM_PROMPT_EN,
  CANCEL_SYSTEM_PROMPT_EN,
} from './systemPrompt'
import typia from "typia";
import dotenv from "dotenv";
import OpenAI from "openai";

import { BootAgenticaVectorSelector } from "@agentica/vector-selector";
import { configureSqliteStrategy } from "@agentica/vector-selector/strategy";
import Database from "better-sqlite3";

dotenv.config();

async function main() {
  const server: WebSocketServer<
    null,
    IAgenticaRpcService<"chatgpt">,
    IAgenticaRpcListener
  > = new WebSocketServer();
  console.log("🟢 Server is starting on ws://localhost:3001");
  const db = new Database(":memory:");

  const selectorExecute = BootAgenticaVectorSelector({
    strategy: configureSqliteStrategy<"chatgpt">({
      db: db,
      cohereApiKey: process.env.COHERE_API_KEY || "",
    }),
  });

  await server.open(3001, async (acceptor) => {
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
          name: "orca:agent.workflow",
          protocol: "class",
          application: typia.llm.application<WorkflowTool, "chatgpt">(),
          execute: new WorkflowTool(),
        },
        // functions from Swagger/OpenAPI
        /*assertHttpController({
          name: "orca:backend.crud",
          model: "chatgpt",
          document: await fetch(
            "http://localhost:8080/openapi.json",
          ).then(r => r.json()),
          connection: {
            host: "http://localhost:8080",
          },
        }),*/
        /*assertHttpController({
          name: "orca:monitoring",
          model: "chatgpt",
          document: await fetch(
            "http://localhost:8080/openapi.json",
          ).then(r => r.json()),
          connection: {
            host: "http://localhost:8080",
          },
        }),*/
      ],
      config: {
        systemPrompt: {
          common: () => COMMON_SYSTEM_PROMPT_EN,
          initialize: () => INITIALIZE_SYSTEM_PROMPT_EN,
          select: () => SELECT_SYSTEM_PROMPT_EN,
          execute: () => EXECUTE_SYSTEM_PROMPT_EN,
          describe: () => DESCRIBE_SYSTEM_PROMPT_EN,
          cancel: () => CANCEL_SYSTEM_PROMPT_EN,
        },
        executor: {
          select: selectorExecute,
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
