import express from 'express';
import { ownerCreateEmployee, ownerCreateProduct, fetchSizes, fetchColors, ownerAddExpenses } from '../controllers/ownerControllers.js'

const router = express.Router();

router.get('/fetch-sizes', fetchSizes);

export default router;
