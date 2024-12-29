import db from "../../config/db.js";

export const getAllOrganizations = async (req, res) => {

    try {

        const getOrganizationsQuery = `SELECT * FROM organizations;`;

        const organizations = await new Promise((resolve, reject) => {
            db.query(getOrganizationsQuery, (err, results) => {
                if(err){
                    console.log("Cannot able to get the Organization");
                    reject(err);
                }
                else{
                    console.log("Successfully get the Organization");
                    resolve(results);
                }
            });
        });

        return res.status(200).send({
            success: true,
            message: "Organization fetched successfuly",
            organization: organizations,
            total_organizations: organizations.length
        });

    } catch (error) {
        console.log("Error while fetching single organization: ", error);
        return res.status(500).send({
            success: false,
            message: "Internal Server Error"
        });
    }

}