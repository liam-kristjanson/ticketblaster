import mongoose from 'mongoose';
import { createClient } from 'redis';

export const redisClient = createClient({
  url: 'redis://cache:6379'
});

export async function connect(connectionString : string) {
  console.log("Connecting to MongoDB...");
  try {
    await mongoose.connect(connectionString);
    console.log("DB Connected successfuly!");
  } catch (err) {
    console.error("Error connecting to db:", err);
    throw err;
  }
}

export async function connectRedis() {
  console.log("Connecting to redis...")
  await redisClient.connect();
  console.log("Redis connected!");
}