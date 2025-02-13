import express from "express";
const router = express.Router();
import upload from "../config/multer.js";
import { getExampleData, registerUser, loginUser, logoutUser } from "../controllers/userControllers/userAuth.js";
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
import { updateLMEvaluation } from "../controllers/userControllers/updateLMEvaluation.js";
import { updateEvaluation } from "../controllers/employeeControllers/updateEvaluation.js";
import { getEmployeeEvaluation } from "../controllers/employeeControllers/getEvaluation.js";
import { getLMEvaluation } from "../controllers/userControllers/getLMEvaluation.js";
import { editProfile } from "../controllers/userControllers/editProfile.js";
import { getSingleLineManager } from "../controllers/userControllers/getSingleLineManager.js";
import { getAllStaffs } from "../controllers/userControllers/getAllStaffs.js";
import { getSingleStaff } from "../controllers/userControllers/getSingleStaff.js";
import { viewAllPerformanceMetrics } from "../controllers/userControllers/viewAllPerformanceMetric.js";
import { viewDashboard } from "../controllers/employeeControllers/viewDashBoard.js";
import { getActiveUsers } from "../controllers/allUserControllers/getActiveUsers.js";

router.get('/', getExampleData);

// Admin Routes

router.post('/register-user', upload.single('profilePhoto'), registerUser);

router.post('/verify-otp', verifyToken, verifyOTP);

router.post('/login-user', loginUser);

router.post('/logout-user', verifyToken, logoutUser);

router.post('/request-reset-password', requestResetPassword);

router.post('/reset-password/:token', resetPassword);

router.put('/update-profile/:user_id', verifyToken, upload.single('profilePhoto'), editProfile);

router.get('/get-user', verifyToken, getUser);


// GET LINE MANAGERS
router.get('/get-all-LMs', verifyToken, getAllLineManagers);

router.get('/get-single-LM/:lineManagerId', verifyToken, getSingleLineManager);


// GET STAFFS
router.get('/get-all-staffs', verifyToken, getAllStaffs);

router.get('/get-single-staff/:staffId', verifyToken, getSingleStaff);


// VIEW ALL PERFORMANCE METRICS
router.get('/view-performance-metrics', verifyToken, viewAllPerformanceMetrics);


router.post('/evaluate-lm', verifyToken, addLMEvaluation);

router.put('/update-lm-evaluation/:evaluation_id', verifyToken, updateLMEvaluation);

router.get('/get-lm-evaluation/:evaluation_id', verifyToken, getLMEvaluation);



// ---------------------------------------------- BELOW ARE LINE MANAGER AND STAFF ROUTES

// Employee(Line Manager and Staff) Routes

router.post('/register-employee', verifyToken, addEmployee);

router.get('/verify-email', verifyEmail);

router.post('/set-credentials', setCredentials);

router.put('/set-pfp', verifyToken, upload.single('profilePhoto'), setProfilePicture);

router.get('/view-dashboard', verifyToken, viewDashboard);


router.post('/evaluate-employee', verifyToken, addEvaluation);


router.put('/update-emp-evaluation/:evaluation_id', verifyToken, updateEvaluation);

router.get('/get-emp-evaluation/:evaluation_id', verifyToken, getEmployeeEvaluation);




// ALL USERS ROUTES
router.get('/get-active-users', verifyToken, getActiveUsers);

export default router;
