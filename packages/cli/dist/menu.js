"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectAgentMenu = selectAgentMenu;
exports.handleAPIServerMode = handleAPIServerMode;
const inquirer_1 = __importDefault(require("inquirer"));
const utils_1 = require("./utils");
const readline_1 = __importDefault(require("readline"));
async function selectAgentMenu(agents) {
    console.clear();
    const result = await inquirer_1.default.prompt([
        {
            type: "list",
            name: "agent",
            message: "Select an agent to interact with:",
            choices: [
                ...agents.map(agent => ({
                    name: agent.padEnd(25) + " - " + (0, utils_1.getAgentDescription)(agent),
                    value: agent,
                    short: agent
                })),
                new inquirer_1.default.Separator(),
                "Exit",
            ],
        },
    ]);
    return result.agent === "Exit" ? null : result.agent;
}
async function handleAPIServerMode(service) {
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
            const result = await inquirer_1.default.prompt([{
                    type: "list",
                    name: "api",
                    message: "Select API example (Ctrl+C to go back):",
                    choices: [...apiExamples, new inquirer_1.default.Separator(), "Back to Main Menu"]
                }]).catch(() => {
                throw new Error("INTERRUPTED");
            });
            if (result.api === "Back to Main Menu") {
                break;
            }
            console.log(`Selected API: ${result.api}`);
            await new Promise((resolve) => {
                const rl = readline_1.default.createInterface({
                    input: process.stdin,
                    output: process.stdout,
                });
                rl.question('\nPress Enter to continue...', () => {
                    rl.close();
                    resolve();
                });
            });
        }
        catch (err) {
            console.log("\n🔙 Returning to main menu...");
            break;
        }
    }
}
