import db from '../../config/db.js';
import jwt from 'jsonwebtoken';

export const getUser = async (req, res) => {

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


        const checkIfUserAdmin = `
            SELECT * FROM users WHERE user_id = ? AND (created_by IS NULL OR created_by = 0);
        `;

        const isAdmin = await new Promise((resolve, reject) => {
            db.query(checkIfUserAdmin, [userId], (err, results) => {
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
                message: "You are not an admin"
            });
        }


        const getUserQuery = `
            SELECT * FROM users u JOIN organizations o ON u.selected_organization_id = o.organization_id 
            WHERE u.user_id = ? AND u.is_active = 1 AND o.is_active = 1 AND (u.created_by IS NULL OR u.created_by = 0);
        `;
        
        const user = await new Promise((resolve, reject) => {
            db.query(getUserQuery, [userId], (err, results) => {
                if(err){
                    return reject(err);
                }
                else{
                    return resolve(results[0]);
                }
            });
        });

        if(!user){
            return res.status(400).send({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).send({
            success: true,
            message: "Successfully fetched the user",
            admin: user
        });

    } catch (error) {
        console.log("Error while fetching single user data: ", error);
        
        return res.status(500).send({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }

}