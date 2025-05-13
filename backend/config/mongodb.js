// config/mongodb.js

import { MongoClient } from 'mongodb';

// Replace with your actual credentials
const username = 'venujagamage2002';
const password = encodeURIComponent('rS4E3jmoeJl7OR6u'); // Always encode passwords
const cluster = 'cluster0.jsrp0t4.mongodb.net';
const dbName = 'polocity';

// Construct URI
const uri = `mongodb+srv://${username}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

// Connection caching
let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    const client = new MongoClient(uri, {
      maxPoolSize: 50,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 5000,
    });

    await client.connect();

    const db = client.db(dbName);

    await db.command({ ping: 1 });
    console.log('✅ Successfully connected to MongoDB Atlas');

    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error('❌ MongoDB Atlas connection error:', error);
    throw new Error('Failed to connect to MongoDB Atlas');
  }
}

export async function closeDatabaseConnection() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
    console.log('🛑 MongoDB Atlas connection closed');
  }
}
