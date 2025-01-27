import express from "express";
const router = express.Router();
import upload from "../config/multer.js";
import { getExampleData, registerUser, loginUser } from "../controllers/userControllers/userAuth.js";
import { verifyOTP } from "../controllers/userControllers/verifyOTP.js";
import { verifyToken } from "../middlewares/authorization.js";
import { requestResetPassword } from "../controllers/userControllers/requestResetPassword.js";
import { resetPassword } from "../controllers/userControllers/resetPassword.js";
import { getUser } from "../controllers/userControllers/getUser.js";
import { addEmployee } from "../controllers/employeeControllers/addEmployee.js";
import { verifyEmail } from "../controllers/employeeControllers/verifyEmail.js";
import { setCredentials } from "../controllers/employeeControllers/setUsernameAndPassword.js";
import { setProfilePicture } from './../controllers/employeeControllers/setProfilePhoto.js';
import { getAllLineManagers } from "../controllers/userControllers/getAllLineManagers.js";
import { addEvaluation } from "../controllers/employeeControllers/addEvaluation.js";
import { addLMEvaluation } from "../controllers/userControllers/addLMEvaluation.js";

router.get('/', getExampleData);

// Admin Routes

router.post('/register-user', upload.single('profilePhoto'), registerUser);

router.post('/verify-otp', verifyToken, verifyOTP);

router.post('/login-user', loginUser);

router.post('/request-reset-password', requestResetPassword);

router.post('/reset-password/:token', resetPassword);

router.get('/get-user', getUser);


router.post('/evaluate-lm', verifyToken, addLMEvaluation);


// Employee(Line Manager and Staff) Routes

router.post('/register-employee', verifyToken, addEmployee);

router.get('/verify-email', verifyEmail);

router.post('/set-credentials', setCredentials);

router.put('/set-pfp', verifyToken, upload.single('profilePhoto'), setProfilePicture);


router.get('/get-all-LMs', verifyToken, getAllLineManagers);


router.post('/evaluate-employee', verifyToken, addEvaluation);

export default router;
