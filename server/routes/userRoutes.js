import express from "express";
const router = express.Router();
import { getExampleData, registerUser, loginUser } from "../controllers/userControllers/userAuth.js";
import verifyOTP from "../controllers/userControllers/verifyOtp.js";
import { verifyToken } from "../middlewares/authorization.js";

router.get('/', getExampleData);

router.post('/register-user', registerUser);

router.post('/verify-otp', verifyToken, verifyOTP);

router.post('/login-user', loginUser);

export default router;
