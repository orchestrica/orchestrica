import { Request, Response } from "express";
import agentService from "../services/agentService";

export function listAgentPool(_req: Request, res: Response) {
  try {
    const agents = agentService.getAll();
    res.status(200).json(agents);
  } catch {
    res.status(500).json({ error: "Failed to fetch agent pool" });
  }
}

export function routeToAgent(req: Request, res: Response) {

  try {
    const selected = "test";
    res.status(200).json({ agentId: selected });
  } catch {
    res.status(500).json({ error: "Routing failed" });
  }
}

export function listTemplates(_req: Request, res: Response) {
  try {
    const templates = agentService.getTemplates();
    res.status(200).json(templates);
  } catch {
    res.status(500).json({ error: "Failed to fetch templates" });
  }
}

export function getTemplateById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const template = agentService.getTemplateById(id);
    if (!template) return res.status(404).json({ error: "Not found" });
    res.status(200).json(template);
  } catch {
    res.status(500).json({ error: "Template fetch failed" });
  }
}

export function getSessionState(req: Request, res: Response) {
  const sessionId = req.params.id;
  // TODO: Redis
  res.status(200).json({ sessionId, state: {} });
}

export function saveSessionState(req: Request, res: Response) {
  const sessionId = req.params.id;
  const state = req.body;
  // TODO: Redis
  res.status(200).json({ sessionId, saved: true });
}

export function flushTemplateMemory(_req: Request, res: Response) {
  // TODO: Redis
  res.status(200).json({ flushed: true });
}