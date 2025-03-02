import express from 'express';
import { verifyToken } from '../middlewares/authorization.js';
import { addEmployeeRecommendation } from '../controllers/recommendationControllers/addRecommendation.js';

const router = express.Router();

router.post('/add-recommendation', verifyToken, addEmployeeRecommendation);

export default router;