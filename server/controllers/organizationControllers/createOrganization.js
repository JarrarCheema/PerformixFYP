import db from "../../config/db.js";
import jwt from 'jsonwebtoken';

export const createOrganization = async (req, res) => {

    try {
        
        let {name, type, email, phone, noOfDepartments, totalEmployees, address, webURL, startDate} = req.body;

        if(!name || !type || !email || !phone || !noOfDepartments || !totalEmployees || !address || !webURL || !startDate){
            return res.status(400).send({
                success: false,
                message: "Missing Required fields! All fields are required"
            });
        }

         // Check if the Authorization header exists
         let token = req.header("Authorization");
         if (!token) {
             return res.status(401).send({ message: "Authorization token is required" });
         }

         // Verify the token and extract the user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
                 
        if (!userId) {
            return res.status(401).send({ message: "Invalid token" });
        }

        // Check if 'organizations' table exists, create it if it doesn't
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS organizations (
                organization_id INT PRIMARY KEY AUTO_INCREMENT,
                organization_name VARCHAR(255),
                type VARCHAR(255),
                email VARCHAR(255),
                phone VARCHAR(20),
                no_of_departments INT,
                total_employees INT,
                address VARCHAR(255),
                webURL VARCHAR(255),
                start_date DATE,
                created_by INT,
                created_on DATETIME,
                CONSTRAINT fk_organization_created_by FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
            );
        `;

        await new Promise((resolve, reject) => {
            db.query(createTableQuery, (err, results) => {
                if (err) {
                    console.error("Error creating table:", err);
                    reject(err);
                } else {
                    console.log("Checked/Created 'organizations' table.");
                    resolve(results);
                }
            });
        });


        const checkOrganizationExist = `
            SELECT * FROM organizations WHERE organization_name = ? OR email = ? OR webURL = ?;
        `;

        const organization = await new Promise((resolve, reject) => {
            db.query(checkOrganizationExist, [name, email, webURL], (err, results) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(results[0]);
                }
            });
        });

        if(organization){
            return res.status(400).send({
                success: false,
                message: "Organization with same Organization Name, Email or Web-URL already exist"
            });
        }


        const insertOrganizationQuery = `
            INSERT INTO organizations (organization_name, type, email, phone, no_of_departments, total_employees, address, webURL, start_date, created_by, created_on)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        // Get the current timestamp and adjust for Pakistan time (GMT+5)
        const currentTimestamp = new Date();
        currentTimestamp.setHours(currentTimestamp.getHours() + 5); // Add 5 hours to GMT

        // Format the adjusted date to 'YYYY-MM-DD HH:mm:ss'
        const pakistanTime = currentTimestamp.toISOString().slice(0, 19).replace('T', ' ');


        // Insert organization
        const result = await new Promise((resolve, reject) => {
            db.query(
                insertOrganizationQuery,
                [name, type, email, phone, noOfDepartments, totalEmployees, address, webURL, startDate, userId, pakistanTime],
                (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                }
            );
        });

        // Check if the row was inserted
        if (result.affectedRows === 1) {
            const insertedOrganizationId = result.insertId;

            // Fetch the inserted organization
            const fetchOrganizationQuery = `
                SELECT * FROM organizations WHERE organization_id = ?;
            `;
            const organization = await new Promise((resolve, reject) => {
                db.query(fetchOrganizationQuery, [insertedOrganizationId], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results[0]); // Assuming 'id' is the primary key
                });
            });

            return res.status(201).send({
                success: true,
                message: "Organization created successfully",
                organization: organization
            });
        }
    } catch (error) {
        console.log("Error in Creating Organization: ", error);
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }

}