// routes/ownerRoutes.js

import multer from 'multer';
import { connectToDatabase } from '../config/mongodb.js';

import express from 'express';
import { ownerEmployeeAddValidate, ownerProductAddValidate, ownerExpensesAddValidate } from '../middleware/validation.js';
import { ownerCreateEmployee, ownerCreateProduct, fetchSizes, fetchColors, ownerAddExpenses } from '../controllers/ownerControllers.js'

const router = express.Router();

// Configure multer to handle file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory for processing
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 10 // Maximum 10 files
  }
});

router.post('/owner-create-employee', ownerEmployeeAddValidate, ownerCreateEmployee);
router.post('/owner-add-expenses', ownerExpensesAddValidate, ownerAddExpenses);
router.get('/fetch-sizes', fetchSizes);
router.get('/fetch-colors', fetchColors);

// Updated route with both validation and file upload middleware
router.post(
  '/owner-add-product',
  upload.array('images', 10), // Handles 'images' field in multipart/form-data
  ownerProductAddValidate,    // Your validation middleware
  ownerCreateProduct          // Controller logic
);

export default router;
