import express from "express";
const router = express.Router();
import { getExampleData, registerUser, loginUser } from "../controllers/userControllers/userAuth.js";
import { verifyOTP } from "../controllers/userControllers/verifyOTP.js";
import { verifyToken } from "../middlewares/authorization.js";
import { requestResetPassword } from "../controllers/userControllers/requestResetPassword.js";
import { resetPassword } from "../controllers/userControllers/resetPassword.js";

router.get('/', getExampleData);

router.post('/register-user', registerUser);

router.post('/verify-otp', verifyToken, verifyOTP);

router.post('/login-user', loginUser);

router.post('/request-reset-password', requestResetPassword);

router.post('/reset-password/:token', resetPassword);

export default router;
