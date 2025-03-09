import express from 'express';
import { ownerEmployeeAddValidate, ownerProductAddValidate, ownerExpensesAddValidate } from '../middleware/validation.js';
import { ownerCreateEmployee, ownerCreateProduct, fetchSizes, fetchColors } from '../controllers/ownerControllers.js'

const router = express.Router();

router.post('/owner-create-employee', ownerEmployeeAddValidate, ownerCreateEmployee);
router.post('/owner-add-product', ownerProductAddValidate, ownerCreateProduct);
router.post('/owner-add-expenses', ownerExpensesAddValidate, ownerAddExpenses);
router.get('/fetch-sizes', fetchSizes);
router.get('/fetch-colors', fetchColors);

export default router;
