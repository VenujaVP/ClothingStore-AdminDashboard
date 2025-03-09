import express from 'express';
import { ownerEmployeeAddValidate, ownerProductAddValidate } from '../middleware/validation.js';
import { ownerCreateEmployee, ownerCreateProduct, sizes, colors } from '../controllers/ownerControllers.js'

const router = express.Router();

router.post('/owner-create-employee', ownerEmployeeAddValidate, ownerCreateEmployee);
router.post('/owner-add-product', ownerProductAddValidate, ownerCreateProduct);
router.post('/sizes', sizes);
router.post('/colors', colors);
export default router;
