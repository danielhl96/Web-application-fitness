"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "redisClient", {
    enumerable: true,
    get: function() {
        return redisClient;
    }
});
const _redis = require("redis");
const redisUrl = process.env.REDIS_URL || process.env.REDIS_HOST || 'redis://localhost:6379';
const redisClient = (0, _redis.createClient)({
    url: redisUrl
});
redisClient.on('error', (err)=>console.error('Redis Client Error:', err.message));
redisClient.connect().catch((err)=>console.error('Redis connection failed:', err.message));
