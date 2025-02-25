import express from "express";
import { verifyToken } from "../middlewares/authorization.js";
import { createPerformanceParameter } from "../controllers/performanceParameterControllers/createPerformanceParameter.js";
import { updatePerformanceParameter } from "../controllers/performanceParameterControllers/editPerfomanceParameter.js";

const router = express.Router();

router.post('/create-parameter/:id', verifyToken, createPerformanceParameter);

router.put('/edit-parameter/:parameter_id', verifyToken, updatePerformanceParameter);

export default router;