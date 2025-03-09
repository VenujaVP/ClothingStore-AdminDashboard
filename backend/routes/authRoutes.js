// routes/authRoutes.js

import express from 'express';
import { OwnerRegister, handleLogin, requestPasswordReset , resetPassword, customerRegister } from '../controllers/authController.js';  // Ensure path is correct
import { validateOwnerRegister, validateLogin, validateForgotPassword, validateResetPassword, validateCustomerRegister } from '../middleware/validation.js';  // Import validation middleware
import { body } from 'express-validator';

const router = express.Router();

// Owner Auth Routes
router.post('/owner-register', validateOwnerRegister, OwnerRegister);
router.post('/owner-login', validateLogin, handleLogin('OWNERS'));
router.post('/owner-forgot-password', validateForgotPassword, requestPasswordReset('OWNERS', 'Owner'));
router.post('/owner-reset-password', validateResetPassword, resetPassword('OWNERS', 'Owner'));

router.post('/customer-register', validateCustomerRegister, customerRegister);
router.post('/customer-login', validateLogin, handleLogin('CUSTOMERS'));
router.post('/customer-forgot-password', validateForgotPassword, requestPasswordReset('CUSTOMERS', 'Customer'));
router.post('/customer-reset-password', validateResetPassword, resetPassword('CUSTOMERS', 'Customer'));

export default router;
