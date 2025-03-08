//routes/forgotPasswordRoutes.js

import express from 'express';
import {resetPassword } from '../controllers/forgotPasswordController.js';

const router = express.Router();


// Step 2: Reset password
router.post('/reset-password', resetPassword);

export default router;
