// routes/authRoutes.js

import express from 'express';
import { registerOwner, loginOwner, requestOwnerPasswordReset } from '../controllers/authController.js';  // Ensure path is correct
import { validateOwnerRegister, validateLogin, validateForgotPassword } from '../middleware/validation.js';  // Import validation middleware
import { body } from 'express-validator';

const router = express.Router();

// Route for registering a new user
router.post('/owner-register', validateOwnerRegister, registerOwner);
router.post('/owner-login', validateLogin, loginOwner);
router.post('/owner-forgot-password', validateForgotPassword, requestOwnerPasswordReset);

export default router;
