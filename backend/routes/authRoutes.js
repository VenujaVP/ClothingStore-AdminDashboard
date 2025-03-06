// routes/authRoutes.js

import express from 'express';
import { registerOwner, loginUser } from '../controllers/authController.js';  // Ensure path is correct
import { validateOwnerRegister } from '../middleware/validation.js';  // Import validation middleware
import { body } from 'express-validator';

const router = express.Router();

// Route for registering a new user
router.post('/owner-register', validateOwnerRegister, registerOwner);
router.post('/login', loginUser);

export default router;
