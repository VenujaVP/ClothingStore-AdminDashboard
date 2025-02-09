// controllers/forgotPasswordController.js

import crypto from 'crypto';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { findUserByEmail, updateToken } from '../models/userModel.js';
import dotenv from 'dotenv';
import sqldb from '../config/sqldb.js';

dotenv.config();

// Step 1: Request Password Reset
export const requestPasswordReset = (req, res) => {
    const { email } = req.body;
    // console.log(email)

    // Find user by email
    findUserByEmail(email, (err, result) => {
        // console.log(result)
        if (err) return res.status(500).json({ message: "Database error" });
        if (result.length === 0) return res.status(404).json({ message: "User not found" });

        const user = result[0];
        // console.log(user)

        // Generate a password reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        const resetTokenExpiry = new Date(Date.now() + 900000) // Convert to MySQL DATETIME format
          .toISOString()
          .slice(0, 19)
          .replace('T', ' ');

        // Save token in the user record
        updateToken(user.ID, { resetToken, resetTokenExpiry }, (err) => {
            if (err) return res.status(500).json({ message: "Error saving reset token" });

            // Send email with reset link
            const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
            console.log(resetLink)
            
            // SMTP settings for Gmail
            const transporter = nodemailer.createTransport({
                // Or use your preferred email provider
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



// Step 2: Reset Password
export const resetPassword = (req, res) => {
    const { resetToken, newPassword, confirmPassword } = req.body;

    if (!resetToken || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Passwords must match" });
    }

    const currentTime = new Date();

    console.log("resetToken:", resetToken);
    console.log("newPassword:", newPassword);
    console.log("confirmPassword:", confirmPassword);
    console.log("currentTime:", currentTime);

    // Find the user by reset token and check expiry
    const sql = 'SELECT * FROM user WHERE resetToken = ? AND resetTokenExpiry > ?';

    console.log("SQL Query:", sql);
    console.log("Query Parameters:", [resetToken, currentTime]);
    sqldb.query(sql, [resetToken, currentTime], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        console.log(result)
        if (result.length === 0) return res.status(400).json({ message: "Invalid or expired reset token" });

        const user = result[0];
        console.log(user)

        // Hash the new password
        bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
            if (err) return res.status(500).json({ message: "Error hashing password" });

            // Clear the token and expiry before updating the password
            const updateSql = 'UPDATE user SET password = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE ID = ?';
            sqldb.query(updateSql, [hashedPassword, user.ID], (err) => {
                if (err) return res.status(500).json({ message: "Error updating password" });

                res.status(200).json({ message: "Password reset successful" });
            });
        });
    });
};

