"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const memoryController_1 = require("../controllers/memoryController");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /memory/session/{id}:
 *   get:
 *     summary: Get session memory state
 *     description: |
 *       Retrieve the current memory state of a session from Redis.
 *       This memory stores historical context and variables used during previous LLM interactions.
 *       It allows the system to maintain continuity across multiple user prompts.
 *
 *       @param id - The unique identifier of the session (e.g., UUID).
 *       @tag memory
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session state from Redis or store
 */
router.get("/session/:id", memoryController_1.getSessionState);
/**
 * @openapi
 * /memory/session/{id}:
 *   post:
 *     summary: Save session memory state
 *     description: |
 *       Save or update the session memory state in Redis for a specific session ID.
 *       This memory may include context history, variables, or other LLM-relevant state to be used in future tasks.
 *       The memory is stored in Redis and will be referenced in future LLM function calls for context continuity.
 *
 *       @param id - The session identifier, matching the key used for storage and retrieval.
 *       @body - JSON object representing session memory to store.
 *       @tag memory
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: State saved
 */
router.post("/session/:id", memoryController_1.saveSessionState);
/**
 * @openapi
 * /memory/template/flush:
 *   post:
 *     summary: Flush in-memory template store
 *     description: |
 *       Flush (clear) the in-memory cache of prompt templates stored in Redis.
 *       Use this endpoint when you need to reset or refresh the current template state, for example after updating a template.
 *
 *       @tag memory
 *     responses:
 *       200:
 *         description: Template cache flushed
 */
router.post("/template/flush", memoryController_1.flushTemplateMemory);
exports.default = router;
