import { Agentica } from "@agentica/core";
import { OpenAI } from "openai";
import typia from "typia";
import { WebBrowserTool } from "./tools";
import type { IAgenticaHistoryJson } from "@agentica/core";
import { GoogleSearchService } from "@wrtnlabs/connector-google-search";

export async function selectTemplate(
  name: string,
  history: IAgenticaHistoryJson[] = []
): Promise<Agentica<"chatgpt">> {
  console.log(`[selectTemplate] name: "${name}"`);

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const webBrowserControllers = [
    {
      name: "orca:webbrowser",
      protocol: "class",
      application: typia.llm.application<WebBrowserTool, "chatgpt">(),
      execute: new WebBrowserTool(),
    },
  ];

  const googleSearchControllers = [
    {
      name: "orca:google-search",
      protocol: "class",
      application: typia.llm.application<GoogleSearchService, "chatgpt">(),
      execute: new GoogleSearchService({
        serpApiKey: process.env.SERPAPI_API_KEY!,
      }),
    },
  ];

  const configMap: Record<string, { prompt: string; controllers: any[] }> = {
    analyst: {
      prompt: "You're a data analyst. Provide clear, structured insights.",
      controllers: [],
    },
    notion: {
      prompt: "You are Notion bot. Format documents cleanly and upload to Notion API.",
      controllers: [],
    },
    web: {
      prompt: "You're a browser automation agent. You can search and interact with web pages using the API.",
      controllers: webBrowserControllers,
    },
    google: {
      prompt: "You're a google search agent. You can search the web using the API.",
      controllers: googleSearchControllers,
    },
    default: {
      prompt: "",
      controllers: [],
    },
  };

  const selected = configMap[name] || configMap["default"];

  console.log(`[selectTemplate] prompt: ${selected?.prompt}`);
  console.log(`[selectTemplate] controllers: ${selected?.controllers.map(c => c.name).join(", ")}`);

  return new Agentica({
    model: "chatgpt",
    vendor: {
      model: "gpt-4.1-nano",
      api: openai,
    },
    controllers: selected?.controllers || [],
    histories: history,
    config: {
      systemPrompt: {
        initialize: () => selected?.prompt || "",
      },
    },
  });
}