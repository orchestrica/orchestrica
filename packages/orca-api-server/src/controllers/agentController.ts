import { Request, Response } from "express";
import agentService from "../services/agentService";
import { AgentInfo } from "../models/agent";

/**
 * POST /agents/register
 * 새로운 에이전트를 등록합니다.
 */
export function registerAgent(req: Request, res: Response) {
  const data: AgentInfo = req.body;

  if (!data.id || !data.name || !data.status || !data.registeredAt) {
    return res.status(400).json({ error: "Missing required agent fields" });
  }

  try {
    const result = agentService.register(data);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to register agent" });
  }
}

/**
 * GET /agents
 * 등록된 모든 에이전트를 반환합니다.
 */
export function listAgents(_req: Request, res: Response) {
  try {
    const agents = agentService.getAll();
    res.status(200).json(agents);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch agents" });
  }
}

export function listAgentPool(_req: Request, res: Response) {
  try {
    const agents = agentService.getAll();
    res.status(200).json(agents);
  } catch {
    res.status(500).json({ error: "Failed to fetch agent pool" });
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