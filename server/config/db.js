import dotenv from "dotenv";
import mysql from "mysql";

dotenv.config();

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;

// Initial connection without selecting database
const initialConnection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
});

initialConnection.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err.stack);
        return;
    }
    console.log("Connected to MySQL server.");

    // Create database if it doesn't exist
    initialConnection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`, (err) => {
        if (err) {
            console.error("Error creating database:", err);
            return;
        }
        console.log(`Database '${DB_NAME}' is ready.`);

        // Close the initial connection
        initialConnection.end();

        // Establish connection with selected database
        connection.connect((err) => {
            if (err) {
                console.error("Error connecting to the database:", err);
                return;
            }
            console.log("Connected to the database.");

            // Execute table creation queries
            createTables();
        });
    });
});

// Connection with database selected
const connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
});

// Function to create tables
const createTables = () => {
    const queries = [
        `CREATE TABLE IF NOT EXISTS roles (
            role_id INT PRIMARY KEY AUTO_INCREMENT,
            role_name VARCHAR(50) UNIQUE
        );`,
        `INSERT IGNORE INTO roles (role_name) VALUES ('Admin'), ('Line Manager'), ('Staff');`,
        `CREATE TABLE IF NOT EXISTS users (
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            full_name VARCHAR(255) NOT NULL,
            user_name VARCHAR(255) UNIQUE,
            phone VARCHAR(20) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255),
            profile_photo VARCHAR(255),
            role_id INT,
            designation VARCHAR(255),
            is_active TINYINT DEFAULT 1,
            otp VARCHAR(6),
            otp_expires DATETIME,
            reset_token VARCHAR(255),
            reset_token_expires DATETIME,
            verification_token VARCHAR(255),
            created_by INT,
            created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
            selected_organization_id INT DEFAULT NULL,
            is_login TINYINT DEFAULT 0,
            CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE SET NULL
        );`,
        `CREATE TABLE IF NOT EXISTS organizations (
            organization_id INT AUTO_INCREMENT PRIMARY KEY,
            organization_name VARCHAR(255),
            type VARCHAR(255),
            email VARCHAR(255),
            phone VARCHAR(20),
            address VARCHAR(255),
            webURL VARCHAR(255),
            start_date DATE,
            created_by INT,
            created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_active TINYINT DEFAULT 1
        );`,
        `CREATE TABLE IF NOT EXISTS departments (
            dept_id INT AUTO_INCREMENT PRIMARY KEY,
            department_id VARCHAR(20),
            department_name VARCHAR(255),
            created_by INT,
            created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_active TINYINT DEFAULT 1,
            organization_id INT,
            CONSTRAINT fk_organization_id FOREIGN KEY (organization_id) REFERENCES organizations(organization_id) ON DELETE SET NULL
        );`,
        `CREATE TABLE IF NOT EXISTS user_departments (
            user_id INT,
            department_id INT,
            is_line_manager TINYINT DEFAULT 0,
            PRIMARY KEY (user_id, department_id),
            CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
            CONSTRAINT fk_department_id FOREIGN KEY (department_id) REFERENCES departments(dept_id) ON DELETE CASCADE
        );`,
        `CREATE TABLE IF NOT EXISTS performance_metrics (
            metric_id INT AUTO_INCREMENT PRIMARY KEY,
            metric_name VARCHAR(255) NOT NULL,
            description TEXT,
            created_by INT,
            created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_active TINYINT DEFAULT 1,
            CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE
        );`,
        `CREATE TABLE IF NOT EXISTS performance_parameters (
            parameter_id INT AUTO_INCREMENT PRIMARY KEY,
            parameter_name VARCHAR(255) NOT NULL,
            description TEXT,
            created_by INT,
            created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_active TINYINT DEFAULT 1,
            CONSTRAINT fk_parameter_created_by FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL
        );`,
        `CREATE TABLE IF NOT EXISTS metric_parameters (
            metric_param_id INT PRIMARY KEY AUTO_INCREMENT,
            metric_id INT,
            parameter_id INT,
            weightage DECIMAL(5, 2) NOT NULL CHECK (weightage BETWEEN 0 AND 100),
            CONSTRAINT fk_id FOREIGN KEY (metric_id) REFERENCES performance_metrics(metric_id) ON DELETE SET NULL,
            CONSTRAINT fk_parameter_id FOREIGN KEY (parameter_id) REFERENCES performance_parameters(parameter_id) ON DELETE SET NULL
        );`,
        `CREATE TABLE IF NOT EXISTS metric_assignments (
            assignment_id INT PRIMARY KEY AUTO_INCREMENT,
            metric_id INT,
            line_manager_id INT,
            department_id INT,
            assigned_on DATETIME DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_assignment_metric_id FOREIGN KEY (metric_id) REFERENCES performance_metrics(metric_id) ON DELETE SET NULL,
            CONSTRAINT fk_assignment_line_manager_id FOREIGN KEY (line_manager_id) REFERENCES users(user_id) ON DELETE SET NULL,
            CONSTRAINT fk_assignment_department_id FOREIGN KEY (department_id) REFERENCES departments(dept_id) ON DELETE SET NULL
        );`,
        `CREATE TABLE IF NOT EXISTS line_manager_evaluations (
            evaluation_id INT AUTO_INCREMENT PRIMARY KEY,
            admin_id INT NOT NULL,
            line_manager_id INT NOT NULL,
            metric_id INT NOT NULL,
            parameter_id INT NOT NULL,
            marks_obtained DECIMAL(5, 2),
            feedback TEXT,
            evaluated_on DATETIME DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_lm_evaluation_admin_id FOREIGN KEY (admin_id) REFERENCES users(user_id) ON DELETE CASCADE,
            CONSTRAINT fk_lm_evaluation_line_manager_id FOREIGN KEY (line_manager_id) REFERENCES users(user_id) ON DELETE CASCADE,
            CONSTRAINT fk_lm_evaluation_metric_id FOREIGN KEY (metric_id) REFERENCES performance_metrics(metric_id) ON DELETE CASCADE,
            CONSTRAINT fk_lm_evaluation_parameter_id FOREIGN KEY (parameter_id) REFERENCES performance_parameters(parameter_id) ON DELETE CASCADE
        );`,
        `CREATE TABLE IF NOT EXISTS evaluations (
            evaluation_id INT AUTO_INCREMENT PRIMARY KEY,
            line_manager_id INT NOT NULL,
            employee_id INT NOT NULL,
            metric_id INT NOT NULL,
            parameter_id INT NOT NULL,
            marks_obtained DECIMAL(5, 2),
            feedback TEXT,
            evaluated_on DATETIME DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_evaluation_line_manager_id FOREIGN KEY (line_manager_id) REFERENCES users(user_id) ON DELETE CASCADE,
            CONSTRAINT fk_evaluation_employee_id FOREIGN KEY (employee_id) REFERENCES users(user_id) ON DELETE CASCADE,
            CONSTRAINT fk_evaluation_metric_id FOREIGN KEY (metric_id) REFERENCES performance_metrics(metric_id) ON DELETE CASCADE,
            CONSTRAINT fk_evaluation_parameter_id FOREIGN KEY (parameter_id) REFERENCES performance_parameters(parameter_id) ON DELETE CASCADE
        );`
    ];

    queries.forEach(query => {
        connection.query(query, (err) => {
            if (err) {
                console.error("Error executing query:", err);
            }
        });
    });

    console.log("All tables are created (if not exist).");
};

export default connection;
