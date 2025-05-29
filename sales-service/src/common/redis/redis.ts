import Redis from 'ioredis';
import Redlock from 'redlock';

export const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
});

export const redlock = new Redlock(
  [redisClient],
  {
    driftFactor: 0.01,
    retryCount: 5,
    retryDelay: 200, // ms
    retryJitter: 100, // ms
  },
);