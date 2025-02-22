import db from '../../config/db.js';
import jwt from 'jsonwebtoken';

export const deleteEmployee = async (req , res) => {

    try {
        
        const {employee_id} = req.params;
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


        if(!employee_id){
            return res.status(400).send({
                success: false,
                message: "Employee Id is required"
            });
        }

        const checkEmployeeExist = `
            SELECT * FROM users WHERE user_id = ?;
        `;

        const employee = await new Promise((resolve, reject) => {
            db.query(checkEmployeeExist, [employee_id], (err, results) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(results[0]);
                }
            });
        });

        if(!employee){
            return res.status(400).send({
                success: false,
                message: "Employee not found with the Given Id"
            });
        }


        const deleteEmployee = `
            DELETE FROM users WHERE user_id = ? AND created_by = ?;
        `;

        const result = await new Promise((resolve, reject) => {
            db.query(deleteEmployee, [employee_id, userId], (err, results) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(results.affectedRows);
                }
            });
        });

        if(result == 0){
            return res.status(400).send({
                success: false,
                message: "Cannot able to delete Employee"
            });
        }


        return res.status(201).send({
            success: false,
            message: "Employee deleted successfully"
        });



    } catch (error) {
        console.log("Error while deleting employee: ", error);
        return res.status(400).send({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }

}