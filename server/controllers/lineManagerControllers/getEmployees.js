import db from '../../config/db.js';
import jwt from 'jsonwebtoken';

export const getEmployees = async (req, res) => {
    try {
        let token = req.header("Authorization");

        if (!token) {
            return res.status(400).send({
                success: false,
                message: "Token is missing"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        if (!userId) {
            return res.status(401).send({
                success: false,
                message: "Invalid token"
            });
        }

        const checkLineManagerQuery = `
            SELECT COUNT(*) AS count FROM users 
            WHERE user_id = ? AND role_id = 2 AND is_active = 1;
        `;

        const lineManagerCheck = await new Promise((resolve, reject) => {
            db.query(checkLineManagerQuery, [userId], (err, results) => {
                if (err) reject(err);
                else resolve(results[0].count);
            });
        });

        if (lineManagerCheck === 0) {
            return res.status(403).send({
                success: false,
                message: "User is not authorized as a Line Manager"
            });
        }

        const getDepartmentsQuery = `
            SELECT d.dept_id, d.department_name 
            FROM user_departments ud 
            JOIN departments d ON ud.department_id = d.dept_id
            WHERE ud.user_id = ?;
        `;

        const departments = await new Promise((resolve, reject) => {
            db.query(getDepartmentsQuery, [userId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        if (departments.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No departments found for this Line Manager"
            });
        }

        const departmentIds = departments.map(dept => dept.dept_id);
        const getEmployeesQuery = `
            SELECT 
                u.user_id, 
                u.user_name, 
                u.full_name, 
                u.designation, 
                ud.department_id, 
                d.department_name
            FROM users u
            JOIN user_departments ud ON u.user_id = ud.user_id
            JOIN departments d ON ud.department_id = d.dept_id
            WHERE u.role_id = 3 AND ud.department_id IN (?) AND u.is_active = 1;
        `;

        const employees = await new Promise((resolve, reject) => {
            db.query(getEmployeesQuery, [departmentIds], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        if (employees.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No employees found in the managed departments"
            });
        }

        const employeesWithEvaluationStatus = await Promise.all(employees.map(async (employee) => {
            const getTotalMetricParamsQuery = `
                SELECT COUNT(*) AS total_params
                FROM metric_parameters mp
                JOIN metric_assignments ma ON mp.metric_id = ma.metric_id
                WHERE ma.department_id = ? AND ma.line_manager_id = ?;
            `;

            const totalMetricParams = await new Promise((resolve, reject) => {
                db.query(getTotalMetricParamsQuery, [employee.department_id, userId], (err, results) => {
                    if (err) reject(err);
                    else resolve(results[0]?.total_params || 0);
                });
            });

            let evaluatedParams = 0;
            if (totalMetricParams > 0) {
                const getEvaluatedParamsQuery = `
                    SELECT COUNT(*) AS evaluated_params
                    FROM evaluations e
                    JOIN metric_parameters mp ON e.parameter_id = mp.parameter_id
                    JOIN metric_assignments ma ON mp.metric_id = ma.metric_id
                    WHERE e.employee_id = ? AND ma.department_id = ? AND ma.line_manager_id = ?;
                `;

                evaluatedParams = await new Promise((resolve, reject) => {
                    db.query(getEvaluatedParamsQuery, [employee.user_id, employee.department_id, userId], (err, results) => {
                        if (err) reject(err);
                        else resolve(results[0]?.evaluated_params || 0);
                    });
                });
            }

            let evaluationStatus = "Pending";
            if (totalMetricParams > 0 && evaluatedParams === totalMetricParams) {
                evaluationStatus = "Complete";
            }

            return {
                user_id: employee.user_id,
                user_name: employee.user_name,
                full_name: employee.full_name,
                designation: employee.designation,
                department: {
                    department_id: employee.department_id,
                    department_name: employee.department_name
                },
                evaluation_status: evaluationStatus
            };
        }));

        return res.status(200).send({
            success: true,
            message: "Employees fetched successfully",
            employees_count: employeesWithEvaluationStatus.length,
            employees: employeesWithEvaluationStatus
        });

    } catch (error) {
        console.log("Error while fetching employees: ", error);
        return res.status(500).send({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
