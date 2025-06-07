<div align="center">
  <img src="./docs/_static/orca.png" alt="Orchestrica Logo" width="200"/>
</div>

Translations: English · [한국어](./translation/README-kor.md)

**Orchestrica (Orca)** is a developer-friendly orchestration tool built on top of [Agentica](https://github.com/wrtnlabs/agentica), designed for creating, managing, and coordinating multiple AI agents.

It enables prompt-based or config-based agent deployment, and ensures safe and flexible LLM-centric interactions via the MCP and ACP protocols.

## Key Features

- **Agent Orchestration**
  Dynamically spawns and routes agents based on natural language prompts or CLI commands using LLM reasoning.

- **Persistence Store**  
  Stores all conversations and agent states for long-context, persistent interactions.

- **Agent Hub**  
  Save and reuse frequently used agent templates for rapid deployment and customization.

- **Protocol Support**  
  Supports both the Model Context Protocol (MCP) and Agent Communication Protocol (ACP) for structured and flexible agent communication.

- **YAML/JSON-Based Definitions**  
  Agents can be declared in structured YAML or JSON files and deployed easily via CLI.

## CLI Command Overview

| Command | Description |
|---------|-------------|
| `orca prompt` | Sends a natural language prompt and auto-orchestrates agents accordingly |
| `orca agent create` | Manually create a new agent |
| `orca agent create-from-template` | Instantiate an agent from a saved template |
| `orca agent save-template` | Save the current agent settings as a reusable template |
| `orca agent list` | View running agents |
| `orca agent remove` | Remove a specific agent |
| `orca agent logs` | View logs for an agent |
| `orca agent route` | Manually route messages between agents |
| `orca history list` | View conversation history for agents |
| `orca deploy -f` | Deploy agents from a YAML or JSON definition file |

## Common Options

| Option | Description | Example |
|--------|-------------|---------|
| `--type` | Specifies the agent role or type | `--type crawler` |
| `--name` | Sets the agent instance name | `--name news_agent` |
| `--mcp` | Comma-separated list of MCP tools to enable | `--mcp tools/summarize,tools/fetch-url` |
| `--acp` | Key-value configuration for ACP settings | `--acp enable-session=true` |
| `--target` | Routes prompt to a specific agent | `--target summarizer1` |
| `--channel` | Specifies the routing channel between agents | `--channel grpc` |

## YAML/JSON Agent Definition

### YAML Example

```yaml
name: news_agent
type: analyzer
mcp:
  - tools/summarize
  - tools/fetch-url
acp:
  enable-session: true
  shared-context: true
````

### JSON Example

```json
{
  "name": "news_agent",
  "type": "analyzer",
  "mcp": ["tools/summarize", "tools/fetch-url"],
  "acp": {
    "enable-session": true,
    "shared-context": true
  }
}
```

### Deployment Command

```bash
orca deploy -f agent.yaml
```

## Supported Protocols

### 🔹 Model Context Protocol (MCP)

* Structured interface to inject external resources (files, DB rows, APIs) into prompts
* Supports tool schemas such as `tools/list`, `tools/execute`
* Compatible with major LLMs like Claude, GPT, and others

### 🔹 Agent Communication Protocol (ACP)

* Internal protocol for asynchronous message delivery and session-based context sharing
* Maintains conversation flow using dialogue/session IDs
* Designed to support future enhancements like session recovery and persistent agent memory

## Roadmap

| Version | Features                                              |
| ------- | ----------------------------------------------------- |
| 0.1     | Manual agent creation/removal, logs, template saving  |
| 0.2     | Prompt-based agent orchestration, MCP/ACP integration |
| 0.3     | YAML/JSON agent deployment, multi-agent planning      |
| 0.4+    | UI dashboard and advanced visualization               |

## License

MIT License

## Built With

* [Agentica](https://github.com/wrtnlabs/agentica)
* [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
* [Agent Communication Protocol (ACP)](https://github.com/i-am-bee/acp)