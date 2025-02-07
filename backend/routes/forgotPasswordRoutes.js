//routes/forgotPasswordRoutes.js

import express from 'express';
import { requestPasswordReset, resetPassword } from '../controllers/forgotPasswordController.js';

const router = express.Router();

router.post('/request-password-reset', requestPasswordReset);  // Step 1: Send reset email
router.post('/reset', resetPassword);  // Step 2: Reset password

export default router;
