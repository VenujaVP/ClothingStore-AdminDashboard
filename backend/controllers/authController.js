//controllers/authController.js

import { createUser, findUserByEmail } from '../models/userModel.js';
import { validationResult } from 'express-validator';
import sqldb from '../config/sqldb.js';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const registerUser = (req, res) => {
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

    const sql = 'SELECT * FROM USER WHERE EMAIL = ?';
    sqldb.query(sql, [email], (err, result) => {
        if (err) return res.status(500).json({ Error: "Database query error" });

        if (result.length === 0) {
            return res.status(404).json({ Error: "Email not registered" });
        }

        const hashedPassword = result[0].PASSWORD;
        bcrypt.compare(password, hashedPassword, (err, match) => {
            if (err) return res.status(500).json({ Error: "Error during password comparison" });

            if (match) {
                const user = {
                    id: result[0].ID,
                    email: result[0].EMAIL,
                    name: result[0].NAME
                };
                const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1d' });
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Strict',
                    maxAge: 24 * 60 * 60 * 1000
                });
                return res.status(200).json({ Status: "Success", token });
            } else {
                return res.status(401).json({ message: "Invalid password" });
            }
        });
    });
};
  
export { registerUser, loginUser };
