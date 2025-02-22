import express from 'express';
import { verifyToken } from './../middlewares/authorization.js';
import { createPerformanceMetrics } from '../controllers/performanceMatricsControllers/createPerformanceMetric.js';
import { assignMetric } from '../controllers/performanceMatricsControllers/assignMetric.js';
import { getAllMetrics } from '../controllers/performanceMatricsControllers/getAllMetrics.js';

const router = express.Router();

router.post('/create-metric', verifyToken, createPerformanceMetrics);

router.post('/assign-metric', verifyToken, assignMetric);

router.get('/get-metrics', verifyToken, getAllMetrics);

export default router;