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

        const getUserQuery = `SELECT * FROM users WHERE user_id = ?;`;
        
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
            user: user
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