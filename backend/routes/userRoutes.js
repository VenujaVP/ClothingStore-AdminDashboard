//routes/userRoutes.js

import express from 'express';
import { fetchProducts, searchProducts } from '../controllers/userControllers.js';

const router = express.Router();

router.get('/product-fetch', fetchProducts);
router.post('/product-search', searchProducts);

export default router;
