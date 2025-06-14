import { getRedisStore } from "../clients/redisClient";
import { AgentInfo } from "../models/agent";
import { AgentTemplate } from "../models/agentTemplate";

const redis = getRedisStore(process.env.REDIS_URL || "redis://localhost:6379");

async function register(agent: AgentInfo): Promise<AgentInfo> {
  await redis.connect();
  await redis.set(`agent:${agent.id}`, JSON.stringify(agent));
  return agent;
}

async function getAll(): Promise<AgentInfo[]> {
  await redis.connect();
  const data = await redis.getAll();
  return Object.entries(data)
    .filter(([k]) => k.startsWith("agent:") && !k.startsWith("agent:meta:"))
    .map(([, v]) => JSON.parse(v));
}

function routeBySkill(task: string) {
}

async function saveTemplate(template: AgentTemplate): Promise<AgentTemplate> {
  await redis.connect();
  await redis.set(`agent:template:${template.id}`, JSON.stringify(template));
  return template;
}

async function getTemplates(): Promise<AgentTemplate[]> {
  await redis.connect();
  const data = await redis.getAll();
  return Object.entries(data)
    .filter(([k]) => k.startsWith("agent:template:"))
    .map(([, v]) => JSON.parse(v));
}

async function getTemplateById(id: string): Promise<AgentTemplate | undefined> {
  await redis.connect();
  const raw = await redis.get(`agent:template:${id}`);
  return raw ? JSON.parse(raw) : undefined;
}

// Delete agent by id (removes agent:{id} from Redis)
async function deleteAgentById(id: string): Promise<void> {
  await redis.connect();
  await redis.delete(`agent:${id}`);
}

// Get agent by id (mirroring getTemplateById)
async function getAgentById(id: string): Promise<any | undefined> {
  await redis.connect();
  const raw = await redis.get(`agent:${id}`);
  return raw ? JSON.parse(raw) : undefined;
}

// Delete template by id (removes agent:template:{id} from Redis)
async function deleteTemplateById(id: string): Promise<void> {
  await redis.connect();
  await redis.delete(`agent:template:${id}`);
}


async function saveSessionToRedis(sessionId: string, data: any): Promise<void> {
  await redis.connect();
  await redis.set(`session:${sessionId}`, JSON.stringify(data));
}

async function getSessionFromRedis(sessionId: string): Promise<any> {
  await redis.connect();
  const raw = await redis.get(`session:${sessionId}`);
  if (raw) return JSON.parse(raw);
  return null;
}

export default {
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
