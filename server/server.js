import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import organizationRoutes from "./routes/organizationRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";

const app = express();

// Middleware to parse JSON data
app.use(bodyParser.json());  // Handles application/json

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true })); // Handles application/x-www-form-urlencoded

app.use(cors());

// Use routes
app.use('/user', userRoutes);
app.use('/organization', organizationRoutes);
app.use('/department', departmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
