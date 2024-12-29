import db from "../../config/db.js";

export const updateOrganization = async (req, res) => {
    try {
        const { id } = req.params; // Get organization ID from route params
        const updateFields = req.body; // Get fields to update from request body

        if (!id) {
            return res.status(400).send({
                success: false,
                message: "Organization ID is required",
            });
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).send({
                success: false,
                message: "No fields to update provided",
            });
        }

        // Build the dynamic SQL query
        const updateKeys = Object.keys(updateFields);
        const updateValues = Object.values(updateFields);

        const setClause = updateKeys.map((key) => `${key} = ?`).join(", ");
        const updateQuery = `UPDATE organizations SET ${setClause} WHERE organization_id = ?`;

        // Add organization ID to the values array
        updateValues.push(id);

        // Execute the query
        const result = await new Promise((resolve, reject) => {
            db.query(updateQuery, updateValues, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });

        if (result.affectedRows === 0) {
            return res.status(404).send({
                success: false,
                message: "Organization not found or no changes made",
            });
        }

        return res.status(200).send({
            success: true,
            message: "Organization updated successfully",
        });
    } catch (error) {
        console.error("Error updating organization:", error);
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
