
import Redis from "ioredis"
export const redis = new Redis.default(process.env.REDIS_DATABASE_URI ?? "");

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redis.on('connect', () => {
  console.log('Successfully connected to Redis');
});

redis.on('reconnecting', () => {
  console.log('Redis reconnecting...');
});

redis.on('end', () => {
  console.log('Redis connection closed');
});
