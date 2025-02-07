import User from '../models/userModel.js';
import Token from '../models/tokenModel.js';
import { sendResetEmail } from '../services/emailService.js';
import { generateResetToken } from '../utils/generateToken.js';
import bcrypt from 'bcrypt';

export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const resetToken = generateResetToken();
        await Token.create({ userId: user._id, token: resetToken });

        await sendResetEmail(user.email, resetToken);
        res.status(200).json({ message: "Password reset link sent to your email" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const tokenRecord = await Token.findOne({ token });
        if (!tokenRecord) return res.status(400).json({ message: "Invalid or expired token" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(tokenRecord.userId, { password: hashedPassword });

        await Token.deleteOne({ token });
        res.status(200).json({ message: "Password successfully reset" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
