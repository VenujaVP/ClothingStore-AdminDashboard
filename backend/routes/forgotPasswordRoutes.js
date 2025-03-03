//routes/forgotPasswordRoutes.js

import express from 'express';
import { requestPasswordReset, resetPassword } from '../controllers/forgotPasswordController.js';

const router = express.Router();

// Step 1: Send reset email
router.post('/request-password-reset', requestPasswordReset);

// Step 2: Reset password
router.post('/reset-password', resetPassword);

export default router;
