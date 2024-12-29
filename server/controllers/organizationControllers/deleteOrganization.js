import db from "../../config/db.js";

export const deleteOrganization  = async (req, res) => {

    try {
        
        const {id} = req.params;

        const deleteOrganizationQuery = `DELETE FROM organizations WHERE organization_id = ?;`;

        const result = await new Promise((resolve, reject) => {
            db.query(deleteOrganizationQuery, [id], (err, results) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(results);
                }
            });
        });

        if(result.affectedRows === 0){
            return res.status(400).send({
                success: false,
                message: "Data cannot be Deleted as Organization with this ID does not exist"
            });
        }

        return res.status(200).send({
            success: true,
            message: "Organization Data has been deleted Successfully",
        });

    } catch (error) {
        console.log("Error while deleting organization: ", error);
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }

}