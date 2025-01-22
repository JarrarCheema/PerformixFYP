import db from '../../config/db.js';
import jwt from 'jsonwebtoken';

export const getAllLineManagers = async (req , res) => {

    try {
        
        // Check if the Authorization header exists
        let token = req.header("Authorization");

        if(!token){
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

        const checkIfUserIsAdmin = `
            SELECT * FROM users WHERE user_id = ? AND (created_by IS NULL OR created_by = 0);
        `;

        const isAdmin = await new Promise((resolve, reject) => {
            db.query(checkIfUserIsAdmin, [userId], (err, results) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(results[0]);
                }
            });
        });

        if(!isAdmin){
            return res.status(400).send({
                success: false,
                message: "Only Admin user can view all Line Managers"
            });
        }

        // Get all the Line Managers created by the requested Admin alongwith the Line Manager's Departments and Organization Information
        const getLineManagers = `
            SELECT * FROM users u JOIN user_departments ud ON u.user_id = ud.user_id JOIN departments d ON ud.department_id = d.dept_id JOIN organizations o ON d.organization_id = o.organization_id WHERE u.role_id = 2 AND u.created_by = ? AND d.created_by = ? AND u.created_by = ? AND u.is_active = 1 AND d.is_active = 1 AND o.is_active = 1;
        `;

        const lineManagers = await new Promise((resolve , reject) => {
            db.query(getLineManagers, [userId, userId, userId], (err, results) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(results);
                }
            });
        });

        if(!lineManagers){
            return res.status(400).send({
                success: false,
                message: "There are no Line Managers exist"
            });
        }

        return res.status(200).send({
            success: true,
            message: "Line Managers created by you fetched successfully",
            Line_Managers_Count: lineManagers.length,
            Line_Managers: lineManagers
        });

    } catch (error) {
        console.log("Error while fetching all the Line Managers: ", error);
        return res.status(500).send({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }

}