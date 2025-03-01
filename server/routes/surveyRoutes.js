import express from 'express';
import { verifyToken } from '../middlewares/authorization.js';
import { createSurvey } from '../controllers/surveyControllers/createSurvery.js';

const router = express.Router();

router.post('/create-survey/:organization_id', verifyToken, createSurvey);

export default router;