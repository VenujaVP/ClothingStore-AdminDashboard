//routes/userRoutes.js

import express from 'express';
import { searchProducts, filterProducts } from '../controllers/userControllers.js';

const router = express.Router();

// router.get('/product-fetch', fetchProducts);
router.post('/product-search', searchProducts);
router.post('/category-filter', filterProducts);

// router.get('/fetch-product-variations/:productId', fetchProductVariations);
//http://localhost:8082/api/user/fetch-procuct


export default router;
