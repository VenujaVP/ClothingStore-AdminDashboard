import express from 'express';
import { ownerEmployeeAddValidate } from '../middleware/validation.js';
import { ownerCreateEmployee } from '../controllers/ownerControllers.js'

const router = express.Router();

router.post('/owner-create-employee', ownerEmployeeAddValidate, ownerCreateEmployee);

export default router;
