import { Router } from "express";
import {
  registerAgent,
  listAgents,
  listTemplates,
  getTemplateById,
  listAgentPool,
} from "../controllers/agentController";

const router = Router();

/**
 * @openapi
 * /agents:
 *   get:
 *     summary: List all registered agents
 *     responses:
 *       200:
 *         description: List of agents
 */
router.get("/", listAgents);

/**
 * @openapi
 * /agents/register:
 *   post:
 *     summary: Register a new agent
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
router.post("/register", registerAgent);

/**
 * @openapi
 * /agents/templates:
 *   get:
 *     summary: Get list of agent templates
 *     responses:
 *       200:
 *         description: List of templates
 */
router.get("/templates", listTemplates);

/**
 * @openapi
 * /agents/templates/{id}:
 *   get:
 *     summary: Get agent template by ID
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
router.get("/templates/:id", getTemplateById);

/**
 * @openapi
 * /agents/pool:
 *   get:
 *     summary: List all active agent pool
 *     responses:
 *       200:
 *         description: Active agent instances
 */
router.get("/pool", listAgentPool);

export default router;
