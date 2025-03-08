//middleware/validation.js

import { body } from 'express-validator';

export const validateOwnerRegister = [
  // Validate firstName
  body('firstName')
    .isString()
    .withMessage('First Name must be a string')
    .isLength({ min: 3 })
    .withMessage('First Name must be at least 3 characters')
    .notEmpty()
    .withMessage('First Name is required'),

  // Validate lastName
  body('lastName')
    .isString()
    .withMessage('Last Name must be a string')
    .isLength({ min: 3 })
    .withMessage('Last Name must be at least 3 characters')
    .notEmpty()
    .withMessage('Last Name is required'),

  // Validate email
  body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail()
    .notEmpty()
    .withMessage('Email is required'),

  // Validate phone
  body('phone')
    .isString()
    .matches(/^[0-9]{10}$/)
    .withMessage('Phone Number must be 10 digits')
    .notEmpty()
    .withMessage('Phone Number is required'),

  // Validate password
  body('password')
    .isString()
    .withMessage('Password must be a string')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*]/)
    .withMessage('Password must contain at least one special character')
    .notEmpty()
    .withMessage('Password is required'),

  // Validate confirmPassword
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords must match')
    .notEmpty()
    .withMessage('Confirm Password is required')
];

export const validateLogin = [
  // Validate email
  body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail()
    .notEmpty()
    .withMessage('Email is required'),

  // Validate password
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

export const validateForgotPassword = [
  // Validate email
  body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail()
    .notEmpty()
    .withMessage('Email is required'),
];

export const validateResetPassword = [
  // Validate password
  body('password')
    .isString()
    .withMessage('Password must be a string')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*]/)
    .withMessage('Password must contain at least one special character')
    .notEmpty()
    .withMessage('Password is required'),

  // Validate confirmPassword
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords must match')
    .notEmpty()
    .withMessage('Confirm Password is required')
];
