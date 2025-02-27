import express from 'express';
import { verifyToken } from '../middlewares/authorization.js';
import { getEmployees } from '../controllers/lineManagerControllers/getEmployees.js';
import { getEmployeeMetrics } from '../controllers/lineManagerControllers/getEmployeeMetrics.js';
import { viewLineManagerDashboard } from '../controllers/lineManagerControllers/viewLineManagerDashboard.js';

const router = express.Router();

router.get('/get-employees', verifyToken, getEmployees);

router.get('/get-employee-metrics/:user_id', verifyToken, getEmployeeMetrics);

router.get('/view-lm-dashboard', verifyToken, viewLineManagerDashboard);


export default router;