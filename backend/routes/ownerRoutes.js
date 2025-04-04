import express from 'express';
import { ownerEmployeeAddValidate, ownerProductAddValidate, ownerExpensesAddValidate } from '../middleware/validation.js';
import { ownerCreateEmployee, ownerCreateProduct, fetchSizes, fetchColors, ownerAddExpenses } from '../controllers/ownerControllers.js'

const router = express.Router();

router.post('/owner-create-employee', ownerEmployeeAddValidate, ownerCreateEmployee);
router.post('/owner-add-product', ownerProductAddValidate, ownerCreateProduct);
router.post('/owner-add-expenses', ownerExpensesAddValidate, ownerAddExpenses);
router.get('/product-fetch', fetchSizes);
router.get('/fetch-colors', fetchColors);


export default router;
