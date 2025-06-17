"use strict";
/**
 * @openapi
 * components:
 *   schemas:
 *     AgentTemplate:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - module
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the agent template
 *         name:
 *           type: string
 *           description: Human-readable name for the template
 *         description:
 *           type: string
 *           description: Optional description for UI
 *         module:
 *           type: string
 *           description: NPM module name used by orca-agent (e.g., "@agentica/calendar-agent")
 *         systemPrompt:
 *           type: string
 *           description: Optional default system prompt associated with this template
 */
Object.defineProperty(exports, "__esModule", { value: true });
