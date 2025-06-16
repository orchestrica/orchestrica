"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisStore = void 0;
const redis_1 = require("redis");
class RedisMemoryStore {
    constructor(redisUrl) {
        this.client = (0, redis_1.createClient)({ url: redisUrl });
        this.client.on("error", (err) => console.error("Redis Client Error", err));
    }
    async connect() {
        if (!this.client.isOpen) {
            await this.client.connect();
        }
    }
    async set(key, value) {
        await this.client.set(key, value);
    }
    async get(key) {
        return await this.client.get(key);
    }
    async delete(key) {
        await this.client.del(key);
    }
    async getAll() {
        const keys = await this.client.keys("*");
        const result = {};
        for (const key of keys) {
            const value = await this.client.get(key);
            if (value !== null) {
                result[key] = value;
            }
        }
        return result;
    }
    async disconnect() {
        if (this.client.isOpen) {
            await this.client.disconnect();
        }
    }
}
let redisInstance = null;
const getRedisStore = (url) => {
    if (!redisInstance) {
        redisInstance = new RedisMemoryStore(url);
    }
    return redisInstance;
};
exports.getRedisStore = getRedisStore;
