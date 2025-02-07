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
            return callback(err, null);
        }
        callback(null, results);
    });
};

// Update password and reset token
const updatePassword = (userId, { resetToken, resetTokenExpiry }, callback) => {
    const sql = 'UPDATE USER SET resetToken = ?, resetTokenExpiry = ? WHERE ID = ?';
    const values = [resetToken, resetTokenExpiry, userId];
    
    sqldb.query(sql, values, (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};

export { createUser, findUserByEmail, updatePassword };
