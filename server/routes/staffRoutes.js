import express from 'express';
import { verifyToken } from '../middlewares/authorization.js';
import { viewStaffDashboard } from '../controllers/staffControllers/viewStaffDashboard.js';

const router = express.Router();

router.get('/view-staff-dashboard', verifyToken, viewStaffDashboard);



export default router;