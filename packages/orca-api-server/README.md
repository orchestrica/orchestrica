# orca-api-server

`orca-api-server` is the central API service used by Orchestrica to manage and orchestrate AI agents. It supports agent template management, dynamic agent registry, and Redis-based state persistence. This server is stateless and interacts with persistent storage and the agent orchestrator (orca-agent).

---

## Features

- Agent Template Management  
  Register, retrieve, and manage reusable agent templates.

- Agent Pool Coordination  
  Maintain and expose the list of dynamically spawned agents.

- Session Memory Store  
  Manage agent state and chat history across sessions using Redis.

- Stateless Design  
  Handles requests via APIs and delegates orchestration and memory tracking to orca-agent and Redis.

---

## API Overview (OpenAPI Supported)

### 🧠 Agent Management

#### `GET /agents`
Fetch all registered agents.

#### `POST /agents/register`
Register a new agent.  
Request body: conforms to the `AgentInfo` schema.

#### `GET /agents/templates`
List all available agent templates.

#### `GET /agents/templates/:id`
Get details of a specific template by ID.

#### `GET /agents/pool`
Return a list of dynamically created agent instances.

---

### 💾 Memory Management

#### `GET /memory/session/:id`
Fetch the stored session state by session ID.

#### `POST /memory/session/:id`
Save session memory for a given session ID.

#### `POST /memory/template/flush`
Flush the in-memory template cache (if applicable).

---

## Tech Stack

- Node.js (TypeScript)
- Express.js
- Redis
- Swagger (OpenAPI)

---

## Getting Started

### Prerequisites

- Node.js v18+
- Redis (running locally or via Docker)

### Installation

```bash
cd packages/orca-api-server
npm install
```

### Run the Server

```bash
# Development mode
npm run start:dev

# Production build
npm run build
npm start
```

### Environment Variables

- `REDIS_URL` – Redis connection URI (e.g., `redis://localhost:6379`)
- `PORT` – Port for the HTTP server (default: 3000)

---

## Roadmap

- Add template creation & deletion APIs
- Integrate agent runtime status monitoring
- Add authentication and access control