import express from 'express';
import { verifyToken } from '../middlewares/authorization.js';
import { createSurvey } from '../controllers/surveyControllers/createSurvery.js';
import { getSurveysForEmployee } from '../controllers/surveyControllers/getSurveyForEmployees.js';
import { getSingleSurveyDetails } from '../controllers/surveyControllers/getSingleSurveyDetails.js';

const router = express.Router();

router.post('/create-survey/:organization_id', verifyToken, createSurvey);

router.get('/get-surveys', verifyToken, getSurveysForEmployee);

router.get('/get-survey-details/:survey_id', verifyToken, getSingleSurveyDetails);

export default router;