import { describe, it, expect } from "vitest";
import { execSync } from "child_process";
import path from "path";

describe("CLI", () => {
  const tsNodePath = path.resolve(__dirname, "../../../node_modules/.bin/ts-node");
  const cliPath = path.resolve(__dirname, "../../../packages/cli/src/index.ts");

  it("should display help information when no arguments are passed", () => {
    const output = execSync(`${tsNodePath} ${cliPath} --help`).toString();
    expect(output).toContain("Start Orca interactive CLI");
    expect(output).toContain("Start Orca dashboard (UI)");
  });
});