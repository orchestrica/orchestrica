"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const agentController_1 = require("../controllers/agentController");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /agents:
 *   get:
 *     summary: List all registered agents
 *     description: |
 *       Retrieve a list of all currently registered AI agents in the system.
 *       Each agent contains metadata such as name, model type, and its current state.
 *
 *       This information is helpful for understanding what agents are available for task delegation or routing.
 *       LLM can use this information to determine which agents are capable of executing a task.
 *
 *       @tag agent
 *     responses:
 *       200:
 *         description: List of agents
 */
router.get("/", agentController_1.listAgents);
/**
 * @openapi
 * /agents/register:
 *   post:
 *     summary: Register a new agent
 *     description: |
 *       Register a new AI agent in the system.
 *       This involves assigning a name, selecting a model, and optionally linking a prompt template.
 *
 *       The agent will be available for routing tasks once registered. The data should conform to the AgentInfo schema.
 *
 *       @body - The agent metadata to register. Includes agent name, model type, and optional template references.
 *       @tag agent
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AgentInfo'
 *     responses:
 *       201:
 *         description: Agent registered
 */
router.post("/register", agentController_1.registerAgent);
/**
 * @openapi
 * /agents/templates:
 *   get:
 *     summary: Get list of agent templates
 *     description: |
 *       Fetch a list of available prompt templates for AI agents.
 *       Templates are predefined instruction sets used to initialize agent behavior.
 *
 *       Useful when selecting or customizing agents for specific tasks or workflows.
 *
 *       @tag template
 *     responses:
 *       200:
 *         description: List of templates
 */
router.get("/templates", agentController_1.listTemplates);
/**
 * @openapi
 * /agents/templates/{id}:
 *   get:
 *     summary: Get agent template by ID
 *     description: |
 *       Retrieve the detailed content of a specific prompt template using its ID.
 *       Templates are used to customize agent behavior at initialization.
 *
 *       @param id - The identifier of the template to fetch.
 *       @tag template
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Template detail
 */
router.get("/templates/:id", agentController_1.getTemplateById);
/**
 * @openapi
 * /agents/pool:
 *   get:
 *     summary: List all active agent pool
 *     description: |
 *       List all AI agent instances currently active in the pool.
 *       These agents are already initialized and ready to perform actions.
 *
 *       This helps the LLM or orchestration layer to understand runtime availability and assign tasks accordingly.
 *
 *       @tag agent
 *     responses:
 *       200:
 *         description: Active agent instances
 */
router.get("/pool", agentController_1.listAgentPool);
exports.default = router;
