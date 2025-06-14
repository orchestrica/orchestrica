import { Router } from "express";
import {
  getSessionState,
  saveSessionState,
  flushTemplateMemory
} from "../controllers/memoryController";

const router = Router();

/**
 * @openapi
 * /memory/session/{id}:
 *   get:
 *     summary: Get session memory state
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
router.get("/session/:id", getSessionState);

/**
 * @openapi
 * /memory/session/{id}:
 *   post:
 *     summary: Save session memory state
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
router.post("/session/:id", saveSessionState);

/**
 * @openapi
 * /memory/template/flush:
 *   post:
 *     summary: Flush in-memory template store
 *     responses:
 *       200:
 *         description: Template cache flushed
 */
router.post("/template/flush", flushTemplateMemory);

export default router;
