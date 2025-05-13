// routes/ownerRoutes.js

import multer from 'multer';
import { connectToDatabase } from '../config/mongodb.js';
import { ObjectId } from 'mongodb';

import express from 'express';
import { ownerEmployeeAddValidate, ownerProductAddValidate, ownerExpensesAddValidate } from '../middleware/validation.js';
import { 
  ownerCreateEmployee, 
  ownerCreateProduct, 
  fetchSizes, 
  fetchColors, 
  ownerAddExpenses,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getProductImages,
  getProductWithImages,
  getProductImageById
} from '../controllers/ownerControllers.js';

const router = express.Router();

// Configure multer to handle file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory for processing
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 10 // Maximum 10 files
  }
});

// Employee routes
router.post('/owner-create-employee', ownerEmployeeAddValidate, ownerCreateEmployee);
router.get('/employees', getAllEmployees);
router.get('/employees/:id', getEmployeeById);
router.put('/employees/:id', updateEmployee);
router.delete('/employees/:id', deleteEmployee);

// Expense routes
router.post('/owner-add-expenses', ownerExpensesAddValidate, ownerAddExpenses);

// Product-related routes
router.get('/fetch-sizes', fetchSizes);
router.get('/fetch-colors', fetchColors);
router.post(
  '/owner-add-product',
  upload.array('images', 10), // This handles file uploads
  ownerProductAddValidate,    // Validation middleware
  ownerCreateProduct          // Controller function
);

// Product image routes
router.get('/product/:productId', getProductWithImages);
router.get('/product/images/:imageId', getProductImageById);
router.get('/product-images/:productId', getProductImages);

export default router;
