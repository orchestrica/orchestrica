# Table of Contents
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Roadmap](#roadmap)

<div align="center">
  <img src="./docs/_static/orca-main.png" alt="Orchestrica Logo" width="200"/>
</div>

Translations: **English** · [Korean](./docs/translation/README-kor.md)

**Orchestrica (Orca)** is a developer-friendly orchestration tool built on top of [Agentica](https://github.com/wrtnlabs/agentica), designed for creating, managing, and coordinating multiple AI agents.

It enables prompt-based or config-based agent deployment, and ensures safe and flexible LLM-centric interactions.

# Key Features

### 🚀 Agent Orchestration
- Create and run agents using prompts or CLI commands
- Agents decide tools and actions on their own
- Supports running multiple agents in parallel or in sequence

### 💾 Persistence Store
- Stores conversation history and agent status
- Helps agents maintain memory and session continuity

### 🧩 Agent Template Management
- Define agent setups in YAML/JSON and reuse them
- Quickly launch agents for specific use cases

### 🧠 LLM-Centric Interaction Layer
- Uses LLM to guide agent logic and decisions
- Supports smart responses, tool usage, and workflow control

# Setup
```sh
npm install @orchestrica/cli
```

```sh
Usage: orca [options] [command]

Options:
  -h, --help      display help for command

Commands:
  start           Start Orca interactive CLI
  dashboard       Start Orca dashboard (UI)
  help [command]  display help for command
```

# Architecture

Orchestrica is built to manage AI agents in a modular and extensible way.

Below is a simplified architecture flow:

<div align="center">
  <img src="./docs/_static/orca-diagram.png" alt="Orchestrica diagram"/>
</div>

### Workflow
```mermaid
graph TD
    %% User Requests
    User1[User 1 Prompt: Summarize recent meeting as code] --> Orca[Orca Agent]
    User2[User 2 Prompt: Reuse my Python code agent] --> Orca

    %% Agent Routing Path (User 1)
    Orca -->|User 1 - Route Step 1| SummaryAgent[MeetingSummaryAgent]
    SummaryAgent -->|User 1 - Summary Output| CodeGenAgent[CodeGeneratorAgent]
    CodeGenAgent -->|User 1 - Final Code Output| Response1[Response to User 1]

    %% Reuse of Previously Created Agent (User 2)
    Orca -->|User 2 - Reuse Agent| PythonAgent[PythonCodeAgent]
    PythonAgent -->|User 2 - Returns with Memory| Response2[Response to User 2]

    %% Memory Storage Section
    subgraph MemoryStorage[Memory Storage]
        Mem_Summary[MeetingSummaryAgent Memory]
        Mem_CodeGen[CodeGeneratorAgent Memory]
        Mem_Python[PythonCodeAgent Memory]
    end

    %% Agent-Memory Connection
    SummaryAgent --> Mem_Summary
    CodeGenAgent --> Mem_CodeGen
    PythonAgent --> Mem_Python

    %% Styling: Emphasize User 1 path with thick solid lines
    linkStyle 2 stroke:#000,stroke-width:3px
    linkStyle 3 stroke:#000,stroke-width:3px
    linkStyle 4 stroke:#000,stroke-width:3px

    %% Styling: User 2 flow with dashed lines
    linkStyle 5 stroke:#666,stroke-width:2px,stroke-dasharray: 5 5
    linkStyle 6 stroke:#666,stroke-width:2px,stroke-dasharray: 5 5

    %% Node class assignments
    class User1 user1;
    class User2 user2;
    class Orca orca;

    %% Class styles
    classDef user1 fill:#E6F0FF,stroke:#3399FF,stroke-width:2px;
    classDef user2 fill:#FFF1E6,stroke:#FF9900,stroke-width:2px;
    classDef orca fill:#0A2540,stroke:#0A2540,stroke-width:2px,color:#FFFFFF;
```

# Roadmap

| Version | Features                                              |
| ------- | ----------------------------------------------------- |
| 0.1     | Manual agent creation/removal, logs, template saving  |
| 0.2     | Prompt-based agent orchestration, MCP/ACP integration |
| 0.3     | YAML/JSON agent deployment, multi-agent planning      |
| 0.4+    | UI dashboard and advanced visualization               |
