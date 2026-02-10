import { MongoDBContainer, StartedMongoDBContainer } from '@testcontainers/mongodb'
import mongoose from 'mongoose'

let mongoContainer: StartedMongoDBContainer

beforeAll(async () => {
    console.log("Running test suite setup...")

    console.log("Starting mongo container...")
    mongoContainer = await new MongoDBContainer('mongo:7').start();
    console.log("Mongo container started");

    const MONGO_URI = mongoContainer.getConnectionString();
    await mongoose.connect(MONGO_URI, {
        dbName: "testDb",
        directConnection: true
    });

    console.log("Database connected!")
}, 60000)

afterAll(async() => {
    console.log("Disconnecting from database...");
    await mongoose.disconnect();
    console.log("Database disconnected");

    console.log("Shutting down mongodb container...");
    await mongoContainer.stop();
    console.log("MongoDb container shut down");
})