import { Redis } from "ioredis"

export  const redis = new Redis("rediss://default:AbBZAAIjcDFmNzA2NDg5OWQyYTE0NmJhYjc0ZGIxM2I1M2UxOGQ4OXAxMA@useful-badger-45145.upstash.io:6379");
// export const redist = new Redis.default({
//   host:""
// })

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


// import Redis from "ioredis";

// // Enhanced Redis configuration with better connection handling
// export const redis = new Redis(process.env.REDIS_DATABASE_URI ?? "redis://localhost:6379", {
//   // Connection options
//   connectTimeout: 10000,
//   lazyConnect: true,
//   maxRetriesPerRequest: 3,
//   retryDelayOnFailover: 100,
//   enableOfflineQueue: false,

//   // Reconnection strategy
//   retryStrategy: (times) => {
//     const delay = Math.min(times * 50, 2000);
//     console.log(`Redis retry attempt ${times}, waiting ${delay}ms`);
//     return delay;
//   },

//   // Connection pool settings
//   family: 4, // Use IPv4
//   keepAlive: true,

//   // Timeouts
//   commandTimeout: 5000,
// });

// // Connection event handlers
// redis.on('connect', () => {
//   console.log('✅ Successfully connected to Redis');
// });

// redis.on('ready', () => {
//   console.log('✅ Redis is ready to receive commands');
// });

// redis.on('error', (err) => {
//   console.error('❌ Redis connection error:', err.message);
//   // Don't exit the process, let ioredis handle reconnection
// });

// redis.on('close', () => {
//   console.log('🔌 Redis connection closed');
// });

// redis.on('reconnecting', (ms) => {
//   console.log(`🔄 Redis reconnecting in ${ms}ms...`);
// });

// redis.on('end', () => {
//   console.log('🛑 Redis connection ended');
// });

// // Graceful shutdown handling
// process.on('SIGINT', async () => {
//   console.log('🛑 Gracefully shutting down Redis connection...');
//   await redis.quit();
//   process.exit(0);
// });

// process.on('SIGTERM', async () => {
//   console.log('🛑 Gracefully shutting down Redis connection...');
//   await redis.quit();
//   process.exit(0);
// });
