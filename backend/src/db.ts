import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING + "ticketblaster";

export async function connect() {
  console.log("Connecting to MongoDB...");
  try {
    mongoose.connect(DB_CONNECTION_STRING);
    console.log("DB Connected successfuly!");
  } catch (err) {
    console.error("Error connecting to db:", err);
    process.exit(1);
  }
}