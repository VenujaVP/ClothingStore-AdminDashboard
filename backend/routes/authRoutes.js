// routes/authRoutes.js

import express from 'express';
import { OwnerRegister, OwnerLogin, ownerRequestPasswordReset, ownerResetPassword } from '../controllers/authController.js';  // Ensure path is correct
import { validateOwnerRegister, validateLogin, validateForgotPassword, validateResetPassword } from '../middleware/validation.js';  // Import validation middleware
import { body } from 'express-validator';

const router = express.Router();

// Route for registering a new user
router.post('/owner-register', validateOwnerRegister, OwnerRegister);
router.post('/owner-login', validateLogin, OwnerLogin);
router.post('/owner-forgot-password', validateForgotPassword, ownerRequestPasswordReset);
router.post('/owner-reset-password', validateResetPassword, ownerResetPassword);

export default router;
