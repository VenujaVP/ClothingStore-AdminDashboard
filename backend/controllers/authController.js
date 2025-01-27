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


  
export { registerUser, loginUser };
