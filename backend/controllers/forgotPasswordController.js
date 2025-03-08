// controllers/forgotPasswordController.js

import crypto from 'crypto';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { findUserByEmail, updateToken } from '../models/userModel.js';
import dotenv from 'dotenv';
import sqldb from '../config/sqldb.js';

dotenv.config();




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
    const sql = 'SELECT * FROM user WHERE resetToken = ? AND resetTokenExpiry < ?';
    // const sql = 'SELECT * FROM user WHERE resetToken = ?';

    // console.log("SQL Query:", sql);
    // console.log("Query Parameters:", [resetToken, currentTime]);

    sqldb.query(sql, [resetToken, currentTime], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        console.log("Query Result:", result);
        if (result.length === 0) return res.status(400).json({ message: "Invalid or expired reset token" });

        const user = result[0];

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

