import db from '../../config/db.js';
import jwt from 'jsonwebtoken';

export const updateGoalStatus = async (req , res) => {

    try {
        
        const { goal_id } = req.params;

        let token = req.header("Authorization");
        if (!token) {
            return res.status(401).send({
                success: false,
                message: "Authorization token is required"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user_id = decoded.id;

        if (!user_id) {
            return res.status(401).send({
                success: false,
                message: "Invalid token"
            });
        }

        const checkIfStaff = `SELECT * FROM users WHERE user_id = ? AND is_active = 1 AND role_id = 3;`;

        const user = await new Promise((resolve, reject) => {
            db.query(checkIfStaff, [user_id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        if (!user.length) {
            return res.status(403).send({
                success: false,
                message: "Only staff members can update goal status."
            });
        }

        if (!goal_id) {
            return res.status(400).send({
                success: false,
                message: "Goal Id required in the params"
            });
        }


        const updateStatusQuery = `
            UPDATE goals SET goal_status = 'Completed' WHERE goal_id = ? AND created_by = ?;
        `;

        const result = await new Promise((resolve, reject) => {
            db.query(updateStatusQuery, [goal_id, user_id], (err, results) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(results.affectedRows);
                }
            });
        });

        if(result == 1 || result === '1' || result === 1){
            return res.status(201).send({
                success: true,
                message: "Goal status updated successfully"
            });
        }

        return res.status(400).send({
            success: true,
            message: "Goal status cannot be updated or you are not the creator of this goal"
        });


    } catch (error) {
        console.log("Error while completing goal status");
        return res.status(500).send({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }

}