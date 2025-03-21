//routes/userRoutes.js

import express from 'express';
import { searchProducts } from '../controllers/userControllers.js';

const router = express.Router();

// router.get('/product-fetch', fetchProducts);
router.post('/product-search', searchProducts);
router.post('/category-filter', filterProducts);

export default router;
