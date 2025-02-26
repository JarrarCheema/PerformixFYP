import db from '../../config/db.js';
import jwt from 'jsonwebtoken';

export const viewAdminDashboard = async (req, res) => {
    try {
        let token = req.header('Authorization');
        if (!token) {
            return res.status(400).json({ success: false, message: "Token is missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user_id = decoded.id;
        if (!user_id) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        const [orgDeptDataResult] = await db.query(`
            SELECT u.user_id, u.user_name, u.full_name, d.dept_id, d.department_name, 
                   o.organization_id, o.organization_Name 
            FROM users u 
            JOIN user_departments ud ON u.user_id = ud.user_id 
            JOIN departments d ON ud.department_id = d.dept_id 
            JOIN organizations o ON d.organization_id = o.organization_id 
            WHERE u.user_id = ?;
        `, [user_id]);

        const orgDeptData = orgDeptDataResult.length ? orgDeptDataResult[0] : null;

        if (!orgDeptData) {
            return res.status(400).json({ success: false, message: "Data not found" });
        }

        const [departmentCountResult] = await db.query(`
            SELECT COUNT(*) AS department_count FROM departments 
            WHERE organization_id = ? AND is_active = 1;
        `, [orgDeptData.organization_id]);

        const departmentCount = departmentCountResult.length ? departmentCountResult[0].department_count : 0;

        const [employeeCountResult] = await db.query(`
            SELECT COUNT(user_id) AS employee_count FROM user_departments 
            WHERE department_id = ? GROUP BY department_id;
        `, [orgDeptData.dept_id]);

        const employeeCount = employeeCountResult.length ? employeeCountResult[0].employee_count : 0;

        const employeesDataResult = await db.query(`
            SELECT u.user_id, u.full_name, u.user_name, u.phone, u.email, u.designation, u.profile_photo 
            FROM users u 
            JOIN user_departments ud ON u.user_id = ud.user_id 
            WHERE ud.department_id = ? AND u.role_id IN (2, 3) AND u.is_active = 1;
        `, [orgDeptData.dept_id]);

        const employeesData = employeesDataResult.length ? employeesDataResult : [];

        const performanceScoresResult = await db.query(`
            SELECT d.department_name, SUM(e.marks_obtained) AS performance_score 
            FROM evaluations e 
            JOIN users u ON e.employee_id = u.user_id 
            JOIN user_departments ud ON u.user_id = ud.user_id 
            JOIN departments d ON ud.department_id = d.dept_id 
            WHERE d.organization_id = ? 
            GROUP BY d.department_name;
        `, [orgDeptData.organization_id]);

        const performanceScores = performanceScoresResult.length ? performanceScoresResult : [];

        return res.status(200).json({
            success: true,
            message: "Dashboard Data fetched successfully",
            total_departments: departmentCount,
            total_employees: employeeCount,
            employees_data: employeesData,
            performance_scores_by_department: performanceScores
        });
    } catch (error) {
        console.error("Error fetching Admin Dashboard information:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
