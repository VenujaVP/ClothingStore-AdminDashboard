//routes/userRoutes.js

import express from 'express';
import { searchProducts, filterProducts, fetchProductDetails } from '../controllers/userControllers.js';

const router = express.Router();

// router.get('/product-fetch', fetchProducts);
router.post('/product-search', searchProducts);
router.post('/category-filter', filterProducts);

router.get('/fetch-product-details/:productId', fetchProductDetails);


export default router;
