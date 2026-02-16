// import { Redis } from 'ioredis';

// // Upstash / Production Redis Config
// console.log("upsatshurl:",process.env.UPSTASH_REDIS_URL)
// const REDIS_URL = process.env.UPSTASH_REDIS_URL || 'redis://localhost:6379';
// export const createRedisClient = (type: 'producer' | 'subscriber' | 'bull') => {
  // return new Redis(REDIS_URL, {
  //   maxRetriesPerRequest: null, // Critical for BullMQ
  //   family: 6, // Often needed for Upstash/Fly.io
  //   tls: REDIS_URL.includes('upstash') ? { rejectUnauthorized: false } : undefined
  // });
// };

import Redis from "ioredis"

export const createRedisClient = (type: 'producer' | 'subscriber' | 'bull') => {
  return new Redis("rediss://default:AfLPAAIncDFiZjA3NGJkZGI5Y2Q0ZWRiYmY2Zjg4ZjZlNWE0MWIyYnAxNjIxNTk@amusing-werewolf-62159.upstash.io:6379",{
    maxRetriesPerRequest:null,
    family:4,
  })
};
// const client = new Redis("rediss://default:AfLPAAIncDFiZjA3NGJkZGI5Y2Q0ZWRiYmY2Zjg4ZjZlNWE0MWIyYnAxNjIxNTk@amusing-werewolf-62159.upstash.io:6379");
// await client.set('foo', 'bar');