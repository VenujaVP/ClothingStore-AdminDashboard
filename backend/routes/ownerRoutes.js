import express from 'express';
import { ownerEmployeeAddValidate, ownerProductAddValidate } from '../middleware/validation.js';
import { ownerCreateEmployee, ownerCreateProduct } from '../controllers/ownerControllers.js'

const router = express.Router();

router.post('/owner-create-employee', ownerEmployeeAddValidate, ownerCreateEmployee);
router.post('/owner-add-product', ownerProductAddValidate, ownerCreateProduct);
export default router;
