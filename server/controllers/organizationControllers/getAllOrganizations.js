import db from "../../config/db.js";
import jwt from 'jsonwebtoken';

export const getAllOrganizations = async (req, res) => {

    try {

        // Check if the Authorization header exists
        let token = req.header("Authorization");
        if (!token) {
            return res.status(401).send({ 
                success: false,
                message: "Authorization token is required" 
            });
        }

        // Verify the token and extract the user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user_id = decoded.id;

        if (!user_id) {
            return res.status(401).send({ 
                success: false,
                message: "Invalid token" 
            });
        }

        const checkIfAdmin = `
            SELECT * FROM users WHERE user_id = ? AND created_by IS NULL OR created_by = 0 AND is_active = 1;
        `;

        const admin = await new Promise((resolve, reject) => {
            db.query(checkIfAdmin, [user_id], (err, results) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(results[0]);
                }
            });
        });

        if(!admin){
            return res.status(400).send({
                success: false,
                message: "You are not an Admin"
            })
        }

        const getOrganizationsQuery = `SELECT * FROM organizations WHERE created_by = ?;`;

        const organizations = await new Promise((resolve, reject) => {
            db.query(getOrganizationsQuery, [user_id], (err, results) => {
                if(err){
                    console.log("Cannot able to get the Organization");
                    reject(err);
                }
                else{
                    console.log("Successfully get the Organization");
                    resolve(results);
                }
            });
        });

        return res.status(200).send({
            success: true,
            message: "Organization fetched successfuly",
            total_organizations: organizations.length,
            organizations: organizations
        });

    } catch (error) {
        console.log("Error while fetching single organization: ", error);
        return res.status(500).send({
            success: false,
            message: "Internal Server Error"
        });
    }

}