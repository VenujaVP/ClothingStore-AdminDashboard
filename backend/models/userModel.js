//models/userModel.js

import bcrypt from 'bcrypt';
import sqldb from '../config/sqldb.js';

const saltRounds = 10;

// Create a new user
const createUser = (fullName, email, phone, password, callback) => {
    if (!password) {
        return callback({ Error: "Password is required" }, null);
    }

    // Hash the password
    bcrypt.hash(password, saltRounds, (err, passwordHash) => {
        if (err) {
            console.log("Error hashing password:", err);
            return callback({ Error: "Error hashing password" }, null);
        }

        // SQL query to insert a new user into the database
        const sql = 'INSERT INTO USER (NAME, EMAIL, PHONE_NUM, PASSWORD) VALUES (?, ?, ?, ?)';
        const values = [fullName, email, phone, passwordHash];

        sqldb.query(sql, values, (err, result) => {
            if (err) {
                console.log("Error inserting data:", err);
                return callback({ Error: "Error inserting data into the server" }, null);
            }
            console.log("User registered successfully");
            return callback(null, { Status: "Success", userId: result.insertId });
        });
    });
};

// Find a user by email
const findUserByEmail = (email, callback) => {
    const query = 'SELECT * FROM USER WHERE email = ?';
    sqldb.query(query, [email], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return callback(err, null);
        }
        callback(null, results);
    });
};

// Update password and reset token
const updateToken = (userId, { resetToken, resetTokenExpiry }, callback) => {
    if (!userId) {
        console.error("Error: userId is undefined or null");
        return callback(new Error("Invalid user ID"), null);
    }

    const query = `UPDATE USER SET resetToken = ?, resetTokenExpiry = ? WHERE ID = ?;`;

    const values = [resetToken, resetTokenExpiry, userId];

    sqldb.query(query, values, (err, results) => {
        if (err) {
            console.error("SQL Error:", err);
            return callback(err, null);
        }

        if (results.affectedRows === 0) {
            console.warn(`No user found with ID: ${userId}`);
            return callback(new Error("User not found"), null);
        }

        console.log(`Reset token updated successfully for user ID: ${userId}`);
        callback(null, results);
        console.log(results)
    });
};



export { createUser, findUserByEmail, updateToken };
