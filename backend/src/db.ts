import mongoose from 'mongoose';

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