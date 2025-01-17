import db from '../../config/db.js';
import jwt from 'jsonwebtoken';

export const createDepartment = async (req , res) => {

    try {
        
        const { department_id, department_name, number_of_employees, LM_of_department, performance_status } = req.body;
        
        // Check if the Authorization header exists
        let token = req.header("Authorization");
        if (!token) {
            return res.status(401).send({ message: "Authorization token is required" });
        }

        if(!department_id || !department_name || !number_of_employees || !LM_of_department || !performance_status){
            return res.status(400).send({
                success: false,
                message: "All fields are required"
            });
        }

        // Verify the token and extract the user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        
        if (!userId) {
            return res.status(401).send({ message: "Invalid token" });
        }

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS departments (
                dept_id INT PRIMARY KEY AUTO_INCREMENT,
                department_id VARCHAR(20),
                department_name VARCHAR(255),
                number_of_employees INT,
                LM_of_department VARCHAR(255),
                performance_status VARCHAR(255),
                created_by INT,
                created_on DATETIME,
                CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
            );
        `;


        await new Promise((resolve, reject) => {
            db.query(createTableQuery, (err, results) => {
                if(err){
                    console.error("Error creating table:", err);
                    reject(err);
                }
                else{
                    console.log("Checked/Created 'departments' table.");
                    resolve(results);
                }
            });
        });

        const checkDepartmentExist = `
            SELECT * FROM departments WHERE department_id = ? OR department_name = ?;
        `;

        const department = await new Promise((resolve, reject) => {
            db.query(checkDepartmentExist, [department_id, department_name], (err, results) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(results[0]);
                }
            });
        });

        if(department){
            return res.status(400).send({
                success: false,
                message: "Department with same Department_Id or Department_Name already exist"
            });
        }

        // Get the current timestamp and adjust for Pakistan time (GMT+5)
        const currentTimestamp = new Date();
        currentTimestamp.setHours(currentTimestamp.getHours() + 5); // Add 5 hours to GMT

        // Format the adjusted date to 'YYYY-MM-DD HH:mm:ss'
        const pakistanTime = currentTimestamp.toISOString().slice(0, 19).replace('T', ' ');

        const insertDepartmentQuery = `
            INSERT INTO departments (department_id, department_name, number_of_employees, LM_of_department, performance_status, created_by, created_on)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `;

        await new Promise((resolve, reject) => {
            db.query(insertDepartmentQuery, [department_id, department_name, number_of_employees, LM_of_department, performance_status, userId, pakistanTime], (err, results) => {
                if(err){
                    return reject(err);
                }
                if(results.affectedRows === 1){
                    console.log("Department Data inserted Successfully");
                    resolve();
                }
                else{
                    reject(new Error("Data Insertion failed"));
                }
            });
        });

        return res.status(201).send({
            success: true,
            message: "Department created successfully"
        });
        
    } catch (error) {
        console.log("Error while creating department: ", error);
        return res.status(500).send({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }

}