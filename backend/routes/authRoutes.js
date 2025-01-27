// routes/authRoutes.js

import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';  // Ensure path is correct
import { validateRegister, validateLogin,validate } from '../middleware/validation.js';  // Import validation middleware
import { body } from 'express-validator';

const router = express.Router();

// Route for registering a new user
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);

export default router;
