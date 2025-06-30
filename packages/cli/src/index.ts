#!/usr/bin/env node

import { Command } from "commander";
import { createConnector, startAgentSession } from "./connector";
import { selectAgentMenu, handleAPIServerMode } from "./menu";

const program = new Command();

async function main() {
  const connector = await createConnector();
  const service = connector.getDriver();
  const agents = ["orca", "orca-api-server"];

  while (true) {
    const agentName = await selectAgentMenu(agents);
    if (!agentName) {
      console.log("👋 Exiting Orca CLI...");
      connector.close();
      break;
    }
    if (agentName === "orca-api-server") {
      await handleAPIServerMode(service);
    } else {
      await startAgentSession(agentName, service);
    }
  }
}

program
  .command("start")
  .description("Start Orca interactive CLI")
  .action(() => {
    main().catch(console.error);
  });

program
  .command("dashboard")
  .description("Start Orca dashboard (UI)")
  .action(() => {
    // TODO: Replace with actual dashboard startup logic
  });

program.parse(process.argv);