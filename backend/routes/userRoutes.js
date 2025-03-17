//routes/userRoutes.js

import express from 'express';
import { fetchProducts } from '../controllers/userControllers.js';

const router = express.Router();

router.get('/product-fetch', fetchProducts);

export default router;
