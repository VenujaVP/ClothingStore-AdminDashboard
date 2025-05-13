// config/mongodb.js
// mongodb+srv://venujagamage2002:<db_password>@cluster0.jsrp0t4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

import { MongoClient } from 'mongodb';
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// ✅ Declare them first
const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
const MONGODB_PASSWORD = encodeURIComponent(process.env.MONGODB_PASSWORD);
const MONGODB_CLUSTER = process.env.MONGODB_CLUSTER;
const MONGODB_NAME = process.env.MONGODB_NAME;

console.log(process.env.MONGODB_USERNAME)
