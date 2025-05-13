// config/mongodb.js
// mongodb+srv://venujagamage2002:<db_password>@cluster0.jsrp0t4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0


import { MongoClient } from 'mongodb';

// Replace these values with your actual credentials
const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
const MONGODB_PASSWORD = encodeURIComponent(process.env.MONGODB_PASSWORD);
const MONGODB_CLUSTER = process.env.MONGODB_CLUSTER;
const DB_NAME = process.env.DB_NAME;

// Construct the connection URI
const MONGODB_URI = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}/${DB_NAME}?retryWrites=true&w=majority`;

// Connection caching
let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    const client = new MongoClient(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 50,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 5000,
    });

    await client.connect();
    const db = client.db(DB_NAME);

    // Verify connection
    await db.command({ ping: 1 });
    console.log('Successfully connected to MongoDB Atlas');

    cachedClient = client;
    cachedDb = db;

    return { client, db };

  } catch (error) {
    console.error('MongoDB Atlas connection error:', error);
    throw new Error('Failed to connect to MongoDB Atlas');
  }
}

export async function closeDatabaseConnection() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
    console.log('MongoDB Atlas connection closed');
  }
}