// routes/authRoutes.js

import express from 'express';
import { registerOwner, loginUser } from '../controllers/authController.js';  // Ensure path is correct
import { validateRegister, validateLogin,validate } from '../middleware/validation.js';  // Import validation middleware
import { body } from 'express-validator';

const router = express.Router();

// Route for registering a new user
router.post('/owner-register', validateRegister, registerOwner);
router.post('/login', validateLogin, loginUser);

export default router;
