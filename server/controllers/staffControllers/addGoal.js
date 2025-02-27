import db from '../../config/db.js';
import jwt from 'jsonwebtoken';

export const addGoal = async (req, res) => {
    try {
        const { task_name, completion_date, description, milestones } = req.body;

        // Check if Authorization header exists
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

        // Check if the user is an active Staff Member (role_id = 3)
        const checkIfStaff = `
            SELECT * FROM users WHERE user_id = ? AND is_active = 1 AND role_id = 3;
        `;

        const user = await new Promise((resolve, reject) => {
            db.query(checkIfStaff, [user_id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        if (!user.length) {
            return res.status(403).send({
                success: false,
                message: "Only staff members can add goals."
            });
        }

        // Validate required fields
        if (!task_name || !completion_date || !description || !milestones) {
            return res.status(400).send({
                success: false,
                message: "All fields are required [task_name, completion_date, description, milestones]"
            });
        }

        // Ensure the 'goals' table exists
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS goals (
                goal_id INT PRIMARY KEY AUTO_INCREMENT,
                task_name VARCHAR(50),
                completion_date DATE,
                task_description VARCHAR(255),
                milestones TEXT,
                attachement VARCHAR(255),
                goal_status VARCHAR(50) DEFAULT 'Pending',
                created_by INT,
                created_on DATETIME DEFAULT NOW(),
                CONSTRAINT fk_goal_created_by FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE
            );
        `;

        await new Promise((resolve, reject) => {
            db.query(createTableQuery, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        // Convert milestones object to a JSON string
        const milestonesJSON = JSON.stringify(milestones);

        // Insert goal into the database
        const insertGoalQuery = `
            INSERT INTO goals (task_name, completion_date, task_description, milestones, goal_status, created_by)
            VALUES (?, ?, ?, ?, ?, ?);
        `;

        const result = await new Promise((resolve, reject) => {
            db.query(insertGoalQuery, [task_name, completion_date, description, milestonesJSON, 'Pending', user_id], (err, results) => {
                if (err) reject(err);
                else resolve(results.affectedRows);
            });
        });

        if (result !== 1) {
            return res.status(400).send({
                success: false,
                message: "Failed to add goal"
            });
        }

        return res.status(201).send({
            success: true,
            message: "Goal added successfully"
        });

    } catch (error) {
        console.error("Error while adding goal:", error);
        return res.status(500).send({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
