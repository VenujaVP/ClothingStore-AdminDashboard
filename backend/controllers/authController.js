//controllers/authController.js

import { createUser, findUserByEmail } from '../models/userModel.js';
import { validationResult } from 'express-validator';
import sqldb from '../config/sqldb.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const registerUser = (req, res) => {
    // console.log(req.body)
    const { fullName, email, phone, password, confirmPassword } = req.body;

    // Check if the user already exists by email
    findUserByEmail(email, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error checking for existing user" });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords must match" });
        }

        // Call the createUser function to insert a new user
        createUser(fullName, email, phone, password, (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            // Return success response
            return res.status(201).json(result);
        });
    });
};

const loginUser = (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ Error: "Email and password are required" });
    }

    const sql = 'SELECT * FROM USER WHERE EMAIL = ?';
    sqldb.query(sql, [email], (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ Error: "Database query error" });
        }

        if (result.length === 0) {
            return res.status(404).json({ Error: "Email not registered" });
        }

        const hashedPassword = result[0].PASSWORD;

        // Compare passwords
        bcrypt.compare(password, hashedPassword, (err, match) => {
            if (err) {
                console.error("Error during password comparison:", err);
                return res.status(500).json({ Error: "Error during password comparison" });
            }

            if (match) {
                const user = {
                    id: result[0].ID,
                    email: result[0].EMAIL,
                    name: result[0].NAME
                };

                // Ensure JWT_SECRET is defined
                if (!process.env.JWT_SECRET) {
                    console.error("JWT_SECRET is not defined");
                    return res.status(500).json({ Error: "Server configuration error" });
                }

                // Create JWT token
                jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
                    if (err) {
                        console.error("Error creating JWT token:", err);
                        return res.status(500).json({ Error: "Error creating token" });
                    }

                    // Set token in cookies
                    res.cookie('token', token, {
                        httpOnly: true, // prevents access to the cookie from JavaScript
                        secure: process.env.NODE_ENV === 'production', // ensures cookie is sent only over HTTPS
                        sameSite: 'Strict', // ensures the cookie is sent in a first-party context
                        maxAge: 3600000, // cookie expiration time (1 hour in ms)
                    });

                    console.log("Token created and sent:", token);
                    return res.status(200).json({ Status: "Success", token });
                });
            } else {
                return res.status(401).json({ message: "Invalid password" });
            }
        });
    });
};

  
export { registerUser, loginUser };
