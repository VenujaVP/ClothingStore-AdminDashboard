import express from 'express';
import { ownerCreateEmployee } from '../controllers/ownerControllers.js'

const router = express.Router();

router.post('/owner-create-employee', ownerCreateEmployee);

export default router;
