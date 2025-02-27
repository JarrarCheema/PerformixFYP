import express from 'express';
import { verifyToken } from '../middlewares/authorization.js';
import { viewStaffDashboard } from '../controllers/staffControllers/viewStaffDashboard.js';
import { viewStaffLeaderboard } from '../controllers/staffControllers/viewStaffLeaderboard.js';

const router = express.Router();

router.get('/view-staff-dashboard', verifyToken, viewStaffDashboard);

router.get('/view-staff-leaderboard', verifyToken, viewStaffLeaderboard);



export default router;