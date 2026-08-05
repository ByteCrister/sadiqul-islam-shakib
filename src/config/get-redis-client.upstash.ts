// src/config/get-redis-client.upstash.ts
import { Redis } from "@upstash/redis";
import { env } from "./env";

let redisStore: Redis | null = null;

const getRedisClient = (): Redis => {
    if (!redisStore) {
        redisStore = new Redis({
            url: env.UPSTASH_REDIS_REST_URL,
            token: env.UPSTASH_REDIS_REST_TOKEN,
        });
    }

    return redisStore;
};

export default getRedisClient;