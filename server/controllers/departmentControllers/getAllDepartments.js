import db from '../../config/db.js';

export const getAllDepartments = async (req , res) => {

    try {
        
        const getDepartmentQuery = `
            SELECT * FROM departments;
        `;

        const departments = await new Promise((resolve, reject) => {
            db.query(getDepartmentQuery, (err, results) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(results);
                }
            });
        });

        if(departments.length === 0){
            return res.status(400).send({
                success: false,
                message: "There is no Department in the Database"
            });
        }

        return res.status(200).send({
            success: true,
            message: "Departments fetched successfully",
            departments_count: departments.length,
            departments: departments
        });

    } catch (error) {
        console.log("Error while fetching all departments data", error);
        return res.status(500).send({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }

}