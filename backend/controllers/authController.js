//controllers/authController.js

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import sqldb from '../config/sqldb.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const saltRounds = 10;

// Owner Auth Part
export const registerOwner = (req, res) => {
    const { firstName, lastName, email, phone, password, confirmPassword } = req.body;

    // Check if the owner already exists by email
    const checkOwnerExistence = 'SELECT * FROM OWNERS WHERE EMAIL = ?';
    
    sqldb.query(checkOwnerExistence, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error checking for existing owner" });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: "owner with this email already exists" });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords must match" });
        }

        // Hash the password
        bcrypt.hash(password, saltRounds, (err, passwordHash) => {
            if (err) {
                console.log("Error hashing password:", err);
                return res.status(500).json({ message: "Error hashing password" });
            }

            // SQL query to insert a new owner into the database
            const sql = `INSERT INTO OWNERS 
                        (F_NAME, L_NAME, EMAIL, PHONE_NUM, PASSWORD) 
                        VALUES (?, ?, ?, ?, ?)`;

            const values = [firstName, lastName, email, phone, passwordHash];

            sqldb.query(sql, values, (err, result) => {
                if (err) {
                    console.log("Error inserting data:", err);
                    return res.status(500).json({ message: "Error inserting data into the server" });
                }

                console.log("Owner registered successfully");
                return res.status(201).json({ Status: "Success" });
            });
        });
    });
};

export const loginOwner = (req, res) => {
    const { email, password } = req.body;
    console.log(req.body)
    // Validate input
    if (!email || !password) {
        return res.status(400).json({ Error: "Email and password are required" });
    }

    const sql = 'SELECT * FROM OWNERS WHERE EMAIL = ?';
    sqldb.query(sql, [email], (err, result) => {
        console.log(result)
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
            console.log(match)
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
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
                        sameSite: 'Lax',
                        maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
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
 
export const requestOwnerPasswordReset = (req, res) => {
    const { email } = req.body;

    // Step 1: Find Owner by email
    const findOwnerQuery = 'SELECT * FROM OWNERS WHERE email = ?';
    sqldb.query(findOwnerQuery, [email], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Owner not found" });
        }

        const owner = results[0];

        // Step 2: Generate password reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 900000) // 15 minutes expiry
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ');

        // Step 3: Update token in database
        const updateTokenQuery = `UPDATE OWNERS SET resetToken = ?, resetTokenExpiry = ? WHERE ID = ?`;
        sqldb.query(updateTokenQuery, [resetToken, resetTokenExpiry, owner.ID], (err, updateResult) => {
            if (err) {
                console.error("Error updating reset token:", err);
                return res.status(500).json({ message: "Error saving reset token" });
            }
            if (updateResult.affectedRows === 0) {
                return res.status(404).json({ message: "Failed to update reset token" });
            }

            // Step 4: Send password reset email
            const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
            console.log("Reset Link:", resetLink);

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Password Reset Request',
                text: `Click on the link to reset your password: ${resetLink}`
            };

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error("Error sending email:", err);
                    return res.status(500).json({ message: "Error sending email", error: err });
                }
                console.log("Email sent:", info.response);
                res.status(200).json({ message: "Password reset email sent successfully" });
            });
        });
    });
};

