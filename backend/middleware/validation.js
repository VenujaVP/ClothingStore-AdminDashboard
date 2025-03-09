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
  body('newPassword')
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
  body('confirmNewPassword')
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage('Passwords must match')
    .notEmpty()
    .withMessage('Confirm Password is required')
];


//Owner Inpage Validations
export const ownerEmployeeAddValidate = [
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
  body('com_password')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords must match')
    .notEmpty()
    .withMessage('Confirm Password is required')
];


export const ownerProductAddValidate = [
  // Validate product_id
  body('product_id')
    .notEmpty()
    .withMessage('Product ID is required')
    .isString()
    .withMessage('Product ID must be a string')
    .isLength({ max: 10 })
    .withMessage('Product ID must be at most 10 characters'),

  // Validate product_name
  body('product_name')
    .notEmpty()
    .withMessage('Product Name is required')
    .isString()
    .withMessage('Product Name must be a string')
    .isLength({ max: 255 })
    .withMessage('Product Name must be at most 255 characters'),

  // Validate product_description
  body('product_description')
    .optional()
    .isString()
    .withMessage('Product Description must be a string'),

  // Validate unit_price
  body('unit_price')
    .notEmpty()
    .withMessage('Unit Price is required')
    .isDecimal()
    .withMessage('Unit Price must be a decimal number')
    .custom((value) => value > 0)
    .withMessage('Unit Price must be greater than 0'),

  // Validate date_added
  body('date_added')
    .notEmpty()
    .withMessage('Date Added is required')
    .isDate()
    .withMessage('Date Added must be a valid date'),

  // Validate shipping_weight
  body('shipping_weight')
    .optional()
    .isDecimal()
    .withMessage('Shipping Weight must be a decimal number')
    .custom((value) => value > 0)
    .withMessage('Shipping Weight must be greater than 0'),

  // Validate total_units
  body('total_units')
    .notEmpty()
    .withMessage('Total Units is required')
    .isInt({ min: 0 })
    .withMessage('Total Units must be a non-negative integer'),

  // Validate category1
  body('category1')
    .notEmpty()
    .withMessage('Category 1 is required')
    .isString()
    .withMessage('Category 1 must be a string')
    .isLength({ max: 100 })
    .withMessage('Category 1 must be at most 100 characters'),

  // Validate category2
  body('category2')
    .optional()
    .isString()
    .withMessage('Category 2 must be a string')
    .isLength({ max: 100 })
    .withMessage('Category 2 must be at most 100 characters'),

  // Validate category3
  body('category3')
    .optional()
    .isString()
    .withMessage('Category 3 must be a string')
    .isLength({ max: 100 })
    .withMessage('Category 3 must be at most 100 characters'),

  // Validate material
  body('material')
    .optional()
    .isString()
    .withMessage('Material must be a string')
    .isLength({ max: 100 })
    .withMessage('Material must be at most 100 characters'),

  // Validate fabric_type
  body('fabric_type')
    .optional()
    .isString()
    .withMessage('Fabric Type must be a string')
    .isLength({ max: 100 })
    .withMessage('Fabric Type must be at most 100 characters'),

  // Validate return_policy
  body('return_policy')
    .optional()
    .isString()
    .withMessage('Return Policy must be a string')
    .isLength({ max: 50 })
    .withMessage('Return Policy must be at most 50 characters'),

  // Validate product_variations
  body('product_variations')
    .isArray({ min: 1 })
    .withMessage('At least one product variation is required')
    .custom((variations) => {
      // Validate each variation
      for (const variation of variations) {
        if (!variation.size || !variation.color || !variation.units) {
          throw new Error('Each variation must have size, color, and units');
        }
        if (typeof variation.units !== 'number' || variation.units < 0) {
          throw new Error('Units must be a non-negative number');
        }
      }
      return true;
    })
    .withMessage('Invalid product variations'),
];


