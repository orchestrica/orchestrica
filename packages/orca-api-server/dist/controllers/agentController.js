"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAgent = registerAgent;
exports.listAgents = listAgents;
exports.listAgentPool = listAgentPool;
exports.listTemplates = listTemplates;
exports.getTemplateById = getTemplateById;
const agentService_1 = __importDefault(require("../services/agentService"));
/**
 * POST /agents/register
 * 새로운 에이전트를 등록합니다.
 */
function registerAgent(req, res) {
    const data = req.body;
    if (!data.id || !data.name || !data.status || !data.registeredAt) {
        return res.status(400).json({ error: "Missing required agent fields" });
    }
    try {
        const result = agentService_1.default.register(data);
        res.status(201).json(result);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to register agent" });
    }
}
/**
 * GET /agents
 * 등록된 모든 에이전트를 반환합니다.
 */
function listAgents(_req, res) {
    try {
        const agents = agentService_1.default.getAll();
        res.status(200).json(agents);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch agents" });
    }
}
function listAgentPool(_req, res) {
    try {
        const agents = agentService_1.default.getAll();
        res.status(200).json(agents);
    }
    catch {
        res.status(500).json({ error: "Failed to fetch agent pool" });
    }
}
function listTemplates(_req, res) {
    try {
        const templates = agentService_1.default.getTemplates();
        res.status(200).json(templates);
    }
    catch {
        res.status(500).json({ error: "Failed to fetch templates" });
    }
}
function getTemplateById(req, res) {
    const { id } = req.params;
    try {
        const template = agentService_1.default.getTemplateById(id);
        if (!template)
            return res.status(404).json({ error: "Not found" });
        res.status(200).json(template);
    }
    catch {
        res.status(500).json({ error: "Template fetch failed" });
    }
}
