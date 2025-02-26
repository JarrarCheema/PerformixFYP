import express from 'express';
import { verifyToken } from '../middlewares/authorization.js';
import { getEmployees } from '../controllers/lineManagerControllers/getEmployees.js';
import { getEmployeeMetrics } from '../controllers/lineManagerControllers/getEmployeeMetrics.js';

const router = express.Router();

router.get('/get-employees', verifyToken, getEmployees);

router.get('/get-employee-metrics/:user_id', verifyToken, getEmployeeMetrics);


export default router;