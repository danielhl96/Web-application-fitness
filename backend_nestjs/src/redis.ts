import { createClient } from "redis";

const redisUrl = process.env.REDIS_HOST || 'redis://redis:6379/0';

export const redisClient = createClient({ url: redisUrl });
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.connect().catch(console.error);