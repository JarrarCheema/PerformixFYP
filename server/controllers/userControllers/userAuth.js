import jwt from "jsonwebtoken";
import db from "../../config/db.js";
import { hashPassword } from "../../helpers/userHelpers.js";
import nodemailer from "nodemailer";

const getExampleData = (req, res) => {
    console.log(process.env.DB_HOST);
    
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ error: 'Database query error' });
        } else {
            res.json(results);
        }
    });
};

const registerUser = async (req, res) => {
    try {
        const { fullname, username, phone, email, password } = req.body;

        console.log("RED.BODY: ", req.body);

        // Check if user has provided all required fields
        if (!username || !email || !password || !fullname || !phone) {
            console.log('Missing required fields', username, email, password, fullname, phone);
            return res.status(400).send({ message: "All fields are required" });
        }

        // Check if 'users' table exists, create it if it doesn't
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                user_id INT AUTO_INCREMENT PRIMARY KEY,
                full_name VARCHAR(255) NOT NULL,
                user_name VARCHAR(255) NOT NULL UNIQUE,
                phone VARCHAR(20) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role_id INT,
                otp VARCHAR(6) NOT NULL,
                otpExpires DATETIME NOT NULL
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

        // Check if user already exists
        const checkUserQuery = `SELECT * FROM users WHERE user_name = ? OR email = ?;`;

        const userExists = await new Promise((resolve, reject) => {
            db.query(checkUserQuery, [username, email], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.length > 0);
                }
            });
        });

        if (userExists) {
            console.log('User already exists with this username or email');
            return res.status(400).send({ message: "User already exists with this username or email" });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);
        console.log('Hashed Password:', hashedPassword);

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const pakistanOffset = 5 * 60 * 60 * 1000;
        const otpExpires = new Date(Date.now() + 300000 + pakistanOffset)
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ');

        const insertUserQuery = `
            INSERT INTO users (full_name, user_name, phone, email, password, role_id, otp, otpExpires) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const savedUserId = await new Promise((resolve, reject) => {
            db.query(insertUserQuery, [fullname, username, phone, email, hashedPassword, 1, otp, otpExpires], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.insertId); // Get the ID of the inserted user
                }
            });
        });

        console.log('User registered successfully');

        console.log("Saved User ID: ", savedUserId);
        

        // Generate JWT token with the user's ID
        const token = jwt.sign({ id: savedUserId }, process.env.JWT_SECRET, { expiresIn: "7d" });
        console.log('Generated Token:', token);

        // Send OTP via email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            port: 465,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP for Performix Email Verification',
            text: `Your OTP: ${otp}. 
It is valid for only 5 minutes.
Thank you!`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).send({ message: "Error sending email" });
            }
            console.log('OTP email sent:', info.response);
            return res.status(201).send({
                success: true,
                message: "User registered successfully. Please check your email for the OTP.",
                token: token
            });
        });

    } catch (error) {
        console.error("Error in Signup: ", error);
        res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};


const loginUser = async (req, res) => {
    try {
        
        let {email, password} = req.body;

        if(!email || !password){
            return res.status(400).send({ message: "Email and Password Required for Login" });
        }

        const getUserQuery = `SELECT * FROM users WHERE otp = 0 AND email = ?;`;

        const userId = await new Promise((resolve, reject) => {
            db.query(getUserQuery, [email], (err, results) => {
                if(err){
                    reject(err);
                }
                if(results.length > 0){
                    resolve(results[0].user_id);
                }
                else{
                    resolve(null);
                }
            });
        });

        if(!userId){
            return res.status(400).send({
                success: false,
                message: "User not registered or you do not have verified your account!"
            });
        }

        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

        return res.status(200).send({
            success: true,
            message: "User Log In Successfully",
            token: token
        });

    } catch (error) {
        if(error){
            console.log("Error in Login User: ", error);
            res.status(500).send({
                success: false,
                message: "Internal Server Error",
                error: error.message
            });
        }
    }
}



export {getExampleData, registerUser, loginUser}
