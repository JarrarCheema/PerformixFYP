import db from '../../config/db.js';
import jwt from 'jsonwebtoken';

export const getAllLineManagers = async (req, res) => {
    try {

        const {organization_id} = req.params;

        // Check if the Authorization header exists
        let token = req.header("Authorization");

        if (!token) {
            return res.status(400).send({
                success: false,
                message: "Token is missing"
            });
        }

        // Verify the token and extract the user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        if (!userId) {
            return res.status(401).send({
                success: false,
                message: "Invalid token"
            });
        }

        // Check if the user is an Admin with a selected organization
        // const checkIfUserIsAdmin = `
        //     SELECT selected_organization_id FROM users 
        //     WHERE user_id = ? AND (created_by IS NULL OR created_by = 0);
        // `;

        // const admin = await new Promise((resolve, reject) => {
        //     db.query(checkIfUserIsAdmin, [userId], (err, results) => {
        //         if (err) reject(err);
        //         else resolve(results[0]);
        //     });
        // });

        // if (!admin) {
        //     return res.status(400).send({
        //         success: false,
        //         message: "Only an Admin with a selected Organization can view Line Managers"
        //     });
        // }

        // const organization_id = admin.selected_organization_id;

        // Get all Line Managers with department and organization info
        const getLineManagers = `
            SELECT 
                u.user_id, 
                u.user_name,
                u.full_name, 
                u.designation,
                d.dept_id,
                d.department_id, 
                d.department_name 
            FROM users u 
            LEFT JOIN user_departments ud ON u.user_id = ud.user_id 
            LEFT JOIN departments d ON ud.department_id = d.dept_id 
            WHERE u.role_id = 2 AND d.organization_id = ? AND u.is_active = 1 AND d.is_active = 1;
        `;

        const lineManagers = await new Promise((resolve, reject) => {
            db.query(getLineManagers, [organization_id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        if (!lineManagers.length) {
            return res.status(400).send({
                success: false,
                message: "No Line Managers found for the selected organization"
            });
        }

        // Fetch Performance Status for each Line Manager
        const lineManagersWithPerformance = await Promise.all(lineManagers.map(async (lm) => {
            const getPerformanceQuery = `
                SELECT
                    pm.metric_name, 
                    pp.parameter_name, 
                    mp.weightage, 
                    le.marks_obtained 
                FROM line_manager_evaluations le
                LEFT JOIN performance_metrics pm ON le.metric_id = pm.metric_id
                LEFT JOIN performance_parameters pp ON le.parameter_id = pp.parameter_id
                LEFT JOIN metric_parameters mp ON le.metric_id = mp.metric_id AND le.parameter_id = mp.parameter_id
                WHERE le.line_manager_id = ?;
            `;

            const performanceData = await new Promise((resolve, reject) => {
                db.query(getPerformanceQuery, [lm.user_id], (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });

            return {
                user_id: lm.user_id,
                user_name: lm.user_name,
                full_name: lm.full_name,
                designation: lm.designation,
                dept_id: lm.dept_id,
                department_id: lm.department_id,
                department: lm.department_name,
                performance_status: performanceData.length ? performanceData : "No evaluations available"
            };
        }));

        return res.status(200).send({
            success: true,
            message: "Line Managers with performance data fetched successfully",
            Line_Managers_Count: lineManagersWithPerformance.length,
            Line_Managers: lineManagersWithPerformance
        });

    } catch (error) {
        console.log("Error while fetching Line Managers: ", error);
        return res.status(500).send({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
