// controllers/forgotPasswordController.js

import crypto from 'crypto';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { findUserByEmail, updateToken } from '../models/userModel.js';
import { console } from 'inspector/promises';

// Step 1: Request Password Reset
export const requestPasswordReset = (req, res) => {
    try {
        console.log("📥 Received request body:", req.body);

        if (!req.body || !req.body.email) {
            console.error("❌ Email is missing in request body!");
            return res.status(400).json({ message: "Email is required" });
        }

        const { email } = req.body;
        console.log("✅ Email received:", email);

        findUserByEmail(email, (err, result) => {
            if (err) {
                console.error("❌ Database error:", err);
                return res.status(500).json({ message: "Database error" });
            }

            if (result.length === 0) {
                console.warn("⚠️ User not found:", email);
                return res.status(404).json({ message: "User not found" });
            }

            const user = result[0];
            console.log("✅ User found:", user);

            const resetToken = crypto.randomBytes(20).toString('hex');
            const resetTokenExpiry = new Date(Date.now() + 3600000)
                .toISOString()
                .slice(0, 19)
                .replace('T', ' ');

            updateToken(user.ID, { resetToken, resetTokenExpiry }, (err) => {
                if (err) {
                    console.error("❌ Error saving reset token:", err);
                    return res.status(500).json({ message: "Error saving reset token" });
                }

                const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
                console.log("🔗 Reset link generated:", resetLink);

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
                        console.error("❌ Error sending email:", err);
                        return res.status(500).json({ message: "Error sending email" });
                    }
                    console.log("📧 Email sent successfully:", info.response);
                    res.status(200).json({ message: "Password reset email sent" });
                });
            });
        });
    } catch (error) {
        console.error("❌ Unexpected error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
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
