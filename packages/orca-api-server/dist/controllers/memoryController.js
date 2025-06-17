"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAgentPool = listAgentPool;
exports.routeToAgent = routeToAgent;
exports.listTemplates = listTemplates;
exports.getTemplateById = getTemplateById;
exports.getSessionState = getSessionState;
exports.saveSessionState = saveSessionState;
exports.flushTemplateMemory = flushTemplateMemory;
const agentService_1 = __importDefault(require("../services/agentService"));
function listAgentPool(_req, res) {
    try {
        const agents = agentService_1.default.getAll();
        res.status(200).json(agents);
    }
    catch {
        res.status(500).json({ error: "Failed to fetch agent pool" });
    }
}
function routeToAgent(req, res) {
    try {
        const selected = "test";
        res.status(200).json({ agentId: selected });
    }
    catch {
        res.status(500).json({ error: "Routing failed" });
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
function getSessionState(req, res) {
    const sessionId = req.params.id;
    // TODO: Redis
    res.status(200).json({ sessionId, state: {} });
}
function saveSessionState(req, res) {
    const sessionId = req.params.id;
    const state = req.body;
    // TODO: Redis
    res.status(200).json({ sessionId, saved: true });
}
function flushTemplateMemory(_req, res) {
    // TODO: Redis
    res.status(200).json({ flushed: true });
}
