import db from '../../config/db.js';
import jwt from 'jsonwebtoken';

export const editProfile = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { fullname, username, phone, organization_name, address } = req.body;
        const profilePhotoPath = req.file ? req.file.path : null;

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
        const tokenUserId = decoded.id;

        if (!tokenUserId) {
            return res.status(401).send({ 
                success: false,
                message: "Invalid token" 
            });
        }

        // Ensure the user can only edit their own profile
        if (tokenUserId !== parseInt(user_id)) {
            return res.status(403).send({
                success: false,
                message: "You do not have permission to update another user's profile",
            });
        }

        // Check if the user exists
        const checkUserQuery = `SELECT * FROM users WHERE user_id = ? AND is_active = 1 AND (created_by IS NULL OR created_by = 0);`;
        const user = await new Promise((resolve, reject) => {
            db.query(checkUserQuery, [user_id], (err, results) => {
                if (err) reject(err);
                else resolve(results[0]);
            });
        });

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "You are not an active Admin",
            });
        }

        // Fetch selected organization
        const organizationId = user.selected_organization_id;
        if (!organizationId) {
            return res.status(400).send({
                success: false,
                message: "No organization selected. Please select an organization first.",
            });
        }

        let userUpdated = false;
        let orgUpdated = false;

        // Prepare dynamic query for updating USER details
        const userUpdateFields = [];
        const userUpdateValues = [];

        if (fullname) {
            userUpdateFields.push("full_name = ?");
            userUpdateValues.push(fullname);
        }
        if (username) {
            userUpdateFields.push("user_name = ?");
            userUpdateValues.push(username);
        }
        if (phone) {
            userUpdateFields.push("phone = ?");
            userUpdateValues.push(phone);
        }
        if (profilePhotoPath) {
            userUpdateFields.push("profile_photo = ?");
            userUpdateValues.push(profilePhotoPath);
        }

        if (userUpdateFields.length > 0) {
            const userUpdateQuery = `
                UPDATE users
                SET ${userUpdateFields.join(", ")}
                WHERE user_id = ?;
            `;
            userUpdateValues.push(user_id);

            const userResult = await new Promise((resolve, reject) => {
                db.query(userUpdateQuery, userUpdateValues, (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });

            if (userResult.affectedRows > 0) {
                userUpdated = true;
            }
        }

        // Prepare dynamic query for updating ORGANIZATION details
        const orgUpdateFields = [];
        const orgUpdateValues = [];

        if (organization_name) {
            orgUpdateFields.push("organization_name = ?");
            orgUpdateValues.push(organization_name);
        }
        if (address) {
            orgUpdateFields.push("address = ?");
            orgUpdateValues.push(address);
        }

        if (orgUpdateFields.length > 0) {
            const orgUpdateQuery = `
                UPDATE organizations
                SET ${orgUpdateFields.join(", ")}
                WHERE organization_id = ?;
            `;
            orgUpdateValues.push(organizationId);

            const orgResult = await new Promise((resolve, reject) => {
                db.query(orgUpdateQuery, orgUpdateValues, (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });

            if (orgResult.affectedRows > 0) {
                orgUpdated = true;
            }
        }

        if (userUpdated || orgUpdated) {
            return res.status(200).send({
                success: true,
                message: "Admin profile and organization details updated successfully",
            });
        } else {
            return res.status(400).send({
                success: false,
                message: "No changes were made. Please update at least one field.",
            });
        }

    } catch (error) {
        console.error("Error while updating admin profile: ", error);
        return res.status(500).send({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
