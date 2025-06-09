# Table of Contents
- [Key Features](#key-features)
- [Roadmap](#roadmap)
- [License](#license)

<div align="center">
  <img src="./docs/_static/orca-main.png" alt="Orchestrica Logo" width="400"/>
</div>

Translations: **English** · [한국어](./translation/README-kor.md)

**Orchestrica (Orca)** is a developer-friendly orchestration tool built on top of [Agentica](https://github.com/wrtnlabs/agentica), designed for creating, managing, and coordinating multiple AI agents.

It enables prompt-based or config-based agent deployment, and ensures safe and flexible LLM-centric interactions.

# Key Features

- **Agent Orchestration**  
  Automatically generates and manages agents based on natural language prompts or predefined CLI commands. Leverages LLM reasoning to determine agent behavior, select appropriate tools, and manage execution flow dynamically. Supports parallel and hierarchical orchestration of multiple agents.

- **Persistence Store**  
  Persists all conversation histories, system messages, and internal agent states to support long-context interactions. Enables memory retrieval, session continuity, and traceable agent behavior.

- **Agent Template Management**  
  Allows users to define, save, and reuse agent templates using YAML or JSON format. Templates can include model selection, tool schema, memory scope, and default system prompts, enabling fast bootstrapping of domain-specific agents.

- **LLM-Centric Interaction Layer**  
  Centralizes agent behavior around LLM planning and reasoning, enabling adaptive response generation, dynamic function calling, and tool-based augmentation (e.g., search, code generation, or summarization).

# Roadmap

| Version | Features                                              |
| ------- | ----------------------------------------------------- |
| 0.1     | Manual agent creation/removal, logs, template saving  |
| 0.2     | Prompt-based agent orchestration, MCP/ACP integration |
| 0.3     | YAML/JSON agent deployment, multi-agent planning      |
| 0.4+    | UI dashboard and advanced visualization               |

# License

MIT License