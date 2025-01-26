import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const sqldb = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

sqldb.connect((err) => {
    if (err) throw err;
    console.log("Database connected!");
});

export default sqldb;