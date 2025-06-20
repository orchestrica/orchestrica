"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConnector = createConnector;
exports.startAgentSession = startAgentSession;
const tgrid_1 = require("tgrid");
const readline_1 = __importDefault(require("readline"));
async function createConnector() {
    const connector = new tgrid_1.WebSocketConnector(null, {
        print: async (evt) => {
            console.log(`[${evt.role}] ${evt.text}`);
        },
        select: async (evt) => {
            const selections = evt.selection || [];
            const names = selections.map((s) => s.name || "(unnamed)").join(", ");
            console.log(`[select] ${selections.length} selected: ${names}`);
        },
        execute: async (evt) => {
            console.log(`[execute] ${evt.operation?.function}`, evt.arguments || {});
        },
        describe: async (evt) => {
            const lines = evt.text.split("\n").filter(Boolean);
            for (const line of lines) {
                console.log(`[describe] ${line.trim()}`);
                await new Promise((r) => setTimeout(r, 150)); // simulate typing delay
            }
        },
        assistantMessage: async (evt) => {
            console.log(`[assistantMessage]`, evt.type || "unknown type");
        },
    });
    await connector.connect("ws://localhost:3001");
    return connector;
}
async function startAgentSession(agentName, service) {
    console.clear();
    const sessionRl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    let sessionInterrupted = false;
    let resolvePrompt = null;
    sessionRl.on("SIGINT", () => {
        sessionInterrupted = true;
        if (resolvePrompt)
            resolvePrompt("");
    });
    const prompt = (question) => new Promise((resolve) => {
        resolvePrompt = resolve;
        sessionRl.question(question, (answer) => {
            resolvePrompt = null;
            resolve(answer);
        });
    });
    console.log(`[${agentName}] Connected. Type your prompt or Ctrl+C to return to Main:`);
    while (true) {
        if (sessionInterrupted)
            break;
        const input = await prompt(`${agentName} > `);
        if (sessionInterrupted)
            break;
        if (input.trim().toLowerCase() === "exit") {
            console.log(`🔙 Returning to Orca main menu from ${agentName}`);
            break;
        }
        try {
            const response = await service.conversate(input);
            if (Array.isArray(response)) {
                console.log(`${agentName} >>`, response.map((r) => r.content).join("\n"));
            }
        }
        catch (err) {
            console.error("❌ Error:", err);
        }
    }
    sessionRl.close();
}
