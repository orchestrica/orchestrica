import inquirer from "inquirer";
import { getAgentDescription } from "./utils";
import readline from "readline";
import { Driver } from "tgrid";
import { IAgenticaRpcService } from "@agentica/rpc";

export async function selectAgentMenu(agents: string[]): Promise<string | null> {
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

export async function handleMcpServerMode(service: Driver<IAgenticaRpcService<"chatgpt">>) {
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