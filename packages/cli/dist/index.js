#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const connector_1 = require("./connector");
const menu_1 = require("./menu");
const program = new commander_1.Command();
async function main() {
    const connector = await (0, connector_1.createConnector)();
    const service = connector.getDriver();
    const agents = ["orca", "orca-mcp-server"];
    while (true) {
        const agentName = await (0, menu_1.selectAgentMenu)(agents);
        if (!agentName) {
            console.log("👋 Exiting Orca CLI...");
            connector.close();
            break;
        }
        if (agentName === "orca-mcp-server") {
            await (0, menu_1.handleMcpServerMode)(service);
        }
        else {
            await (0, connector_1.startAgentSession)(agentName, service);
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
