import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import organizationRoutes from "./routes/organizationRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import performanceMetricRoutes from './routes/performanceMetricRoutes.js';
import performanceParameterRoutes from './routes/performenceParameterRoutes.js';
import lmRoutes from './routes/lineManagerRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import surveyRoutes from './routes/surveyRoutes.js';

const app = express();

// Middleware to parse JSON data
app.use(bodyParser.json());  
app.use(express.urlencoded({ extended: true })); 
app.use(cors());

// Use routes
app.use('/user', userRoutes);
app.use('/lm', lmRoutes);
app.use('/staff', staffRoutes);
app.use('/organization', organizationRoutes);
app.use('/department', departmentRoutes);
app.use('/performance', performanceMetricRoutes);
app.use('/performance', performanceParameterRoutes);
app.use('/survey', surveyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
