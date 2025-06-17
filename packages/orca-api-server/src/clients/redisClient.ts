import { createClient, RedisClientType } from "redis";

class RedisMemoryStore {
  private client: RedisClientType;

  constructor(redisUrl: string) {
    this.client = createClient({ url: redisUrl });
    this.client.on("error", (err) => console.error("Redis Client Error", err));
  }

  async connect(): Promise<void> {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async getAll(): Promise<Record<string, string>> {
    const keys = await this.client.keys("*");
    const result: Record<string, string> = {};
    for (const key of keys) {
      const value = await this.client.get(key);
      if (value !== null) {
        result[key] = value;
      }
    }
    return result;
  }

  async disconnect(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.disconnect();
    }
  }
}

let redisInstance: RedisMemoryStore | null = null;

export const getRedisStore = (url: string): RedisMemoryStore => {
  if (!redisInstance) {
    redisInstance = new RedisMemoryStore(url);
  }
  return redisInstance;
};
