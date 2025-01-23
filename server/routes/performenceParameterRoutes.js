import express from "express";
import { verifyToken } from "../middlewares/authorization.js";
import { createPerformanceParameter } from "../controllers/performanceParameterControllers/createPerformanceParameter.js";

const router = express.Router();

router.post('/create-parameter/:id', verifyToken, createPerformanceParameter);

export default router;