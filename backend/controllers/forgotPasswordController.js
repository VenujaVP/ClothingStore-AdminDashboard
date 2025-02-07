// controllers/forgotPasswordController.js

import crypto from 'crypto';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { findUserByEmail, updateToken } from '../models/userModel.js';

// Step 1: Request Password Reset
export const requestPasswordReset = (req, res) => {
    const { email } = req.body;

    // Find user by email
    findUserByEmail(email, (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (result.length === 0) return res.status(404).json({ message: "User not found" });

        const user = result[0];
        console.log(user)        

        // Generate a password reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        const resetTokenExpiry = new Date(Date.now() + 3600000) // Convert to MySQL DATETIME format
          .toISOString()
          .slice(0, 19)
          .replace('T', ' ');
        
        // Save token in the user record
        updateToken(user.ID, { resetToken, resetTokenExpiry }, (err) => {
            if (err) return res.status(500).json({ message: "Error saving reset token" });

            // Send email with reset link
            const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
            const transporter = nodemailer.createTransport({
                service: 'gmail', // Or use your preferred email provider
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

            // In forgotPasswordController.js
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error("Error sending email:", err);
                    return res.status(500).json({ message: "Error sending email" });
                }
                console.log("Email sent:", info);
                res.status(200).json({ message: "Password reset email sent" });
            });

        });
    });
};

// Step 2: Reset Password
export const resetPassword = (req, res) => {
    const { resetToken, newPassword } = req.body;

    // Find the user by reset token
    const sql = 'SELECT * FROM USER WHERE resetToken = ? AND resetTokenExpiry > ?';
    sqldb.query(sql, [resetToken, Date.now()], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (result.length === 0) return res.status(400).json({ message: "Invalid or expired reset token" });

        const user = result[0];

        // Hash the new password
        bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
            if (err) return res.status(500).json({ message: "Error hashing password" });

            // Update the password in the database
            sqldb.query('UPDATE USER SET PASSWORD = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE ID = ?', [hashedPassword, user.ID], (err) => {
                if (err) return res.status(500).json({ message: "Error updating password" });
                res.status(200).json({ message: "Password reset successful" });
            });
        });
    });
};
