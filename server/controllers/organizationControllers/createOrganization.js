import db from "../../config/db.js";

export const createOrganization = async (req, res) => {

    try {
        
        let {name, type, email, phone, noOfDepartments, totalEmployees, address, webURL, startDate} = req.body;

        if(!name || !type || !email || !phone || !noOfDepartments || !totalEmployees || !address || !webURL || !startDate){
            return res.status(400).send({
                success: false,
                message: "Missing Required fields! All fields are required"
            });
        }

        // Check if 'organizations' table exists, create it if it doesn't
        const createTableQuery = `
            CREATE TABLE organizations (
                organization_id INT PRIMARY KEY AUTO_INCREMENT,
                organization_name VARCHAR(255),
                type VARCHAR(255),
                email VARCHAR(255),
                phone VARCHAR(20),
                no_of_departments INT,
                total_employees INT,
                address VARCHAR(255),
                webURL VARCHAR(255),
                start_date DATE
            );
        `;

        await new Promise((resolve, reject) => {
            db.query(createTableQuery, (err, results) => {
                if (err) {
                    console.error("Error creating table:", err);
                    reject(err);
                } else {
                    console.log("Checked/Created 'users' table.");
                    resolve(results);
                }
            });
        });


        const insertOrganizationQuery = `
            INSERT INTO organizations (organization_name, type, email, phone, no_of_departments, total_employees, address, webURL, start_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        
        await new Promise((resolve, reject) => {
            db.query(insertOrganizationQuery, [name, type, email, phone, noOfDepartments, totalEmployees, address, webURL, startDate], (err, results) => {
                if (err) {
                    return reject(err);
                }
    
                if (results.affectedRows === 1) {
                    console.log("Data inserted successfully."); 
                    resolve(); 
                } else {
                    reject(new Error("Data insertion failed.")); 
                }
            });
        });

        return res.status(201).send({
            success: true,
            message: "Organization created successfully"
        });

    } catch (error) {
        console.log("Error in Creating Organization: ", error);
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }

}