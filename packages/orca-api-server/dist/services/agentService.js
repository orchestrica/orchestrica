"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redisClient_1 = require("../clients/redisClient");
const redis = (0, redisClient_1.getRedisStore)(process.env.REDIS_URL || "redis://localhost:6379");
async function register(agent) {
    await redis.connect();
    await redis.set(`agent:${agent.id}`, JSON.stringify(agent));
    return agent;
}
async function getAll() {
    await redis.connect();
    const data = await redis.getAll();
    return Object.entries(data)
        .filter(([k]) => k.startsWith("agent:") && !k.startsWith("agent:meta:"))
        .map(([, v]) => JSON.parse(v));
}
function routeBySkill(task) {
}
async function saveTemplate(template) {
    await redis.connect();
    await redis.set(`agent:template:${template.id}`, JSON.stringify(template));
    return template;
}
async function getTemplates() {
    await redis.connect();
    const data = await redis.getAll();
    return Object.entries(data)
        .filter(([k]) => k.startsWith("agent:template:"))
        .map(([, v]) => JSON.parse(v));
}
async function getTemplateById(id) {
    await redis.connect();
    const raw = await redis.get(`agent:template:${id}`);
    return raw ? JSON.parse(raw) : undefined;
}
// Delete agent by id (removes agent:{id} from Redis)
async function deleteAgentById(id) {
    await redis.connect();
    await redis.delete(`agent:${id}`);
}
// Get agent by id (mirroring getTemplateById)
async function getAgentById(id) {
    await redis.connect();
    const raw = await redis.get(`agent:${id}`);
    return raw ? JSON.parse(raw) : undefined;
}
// Delete template by id (removes agent:template:{id} from Redis)
async function deleteTemplateById(id) {
    await redis.connect();
    await redis.delete(`agent:template:${id}`);
}
async function saveSessionToRedis(sessionId, data) {
    await redis.connect();
    await redis.set(`session:${sessionId}`, JSON.stringify(data));
}
async function getSessionFromRedis(sessionId) {
    await redis.connect();
    const raw = await redis.get(`session:${sessionId}`);
    if (raw)
        return JSON.parse(raw);
    return null;
}
exports.default = {
    register,
    getAll,
    getAgentById,
    deleteAgentById,
    routeBySkill,
    saveTemplate,
    getTemplates,
    getTemplateById,
    deleteTemplateById,
    saveSessionToRedis,
    getSessionFromRedis
};
