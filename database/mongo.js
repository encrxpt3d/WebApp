const { MongoClient } = require("mongodb");

const mongoUri = process.env.URI;
const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
let db;

const connectDb = async () => {
  try {
    await client.connect();
    db = client.db();
    console.log("[DATABASE]: Connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

const getDb = () => {
  if (!db) {
    throw new Error("Database not initialized.");
  }
  return db;
};

module.exports = { connectDb, getDb };
