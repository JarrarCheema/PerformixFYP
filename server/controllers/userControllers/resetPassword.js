import { comparePassword, hashPassword } from '../../helpers/userHelpers.js';
import db from '../../config/db.js';

export const resetPassword = async (req, res) => {
    try {

        const { token } = req.params;
        const { oldPassword, newPassword } = req.body;

        if(!token){
            return res.status(400).send({
                success: false,
                message: "Token is missing"
            });
        }

        if (!oldPassword || !newPassword) {
            return res.status(400).send({ 
                success: false,
                message: "All fields are required" 
            });
        }

        // Validate the token
        const userQuery = `SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > ?;`;
        const user = await new Promise((resolve, reject) => {
            db.query(userQuery, [token, new Date()], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });

        if (!user) {
            return res.status(400).send({ 
                success: false,
                message: "Invalid or expired reset token" });
        }

        // Verify the old password
        const isMatch = await comparePassword(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).send({ 
                success: false,
                message: "Old password is incorrect" 
            });
        }

        // Hash the new password
        const hashedPassword = await hashPassword(newPassword);

        // Update the user's password and clear the reset token
        const updateQuery = `UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE reset_token = ?;`;
        await new Promise((resolve, reject) => {
            db.query(updateQuery, [hashedPassword, token], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        res.status(200).send({ 
            success: true,
            message: "Password updated successfully" 
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};
