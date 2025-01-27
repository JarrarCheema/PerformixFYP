import db from '../../config/db.js';

export const getLMEvaluation = async (req , res) => {

    try {

        const evaluation_id = req.params;

        if(!evaluation_id){
            return req.status(400).send({
                success: false,
                message: "Evaluation ID required"
            });
        }
        
        const getSingleEvaluation = `
            SELECT e.evaluation_id, ad.full_name AS Admin_FullName, lm.full_name AS Line_Manager_FullName, pm.metric_name, pp.parameter_name, e.marks_obtained, e.feedback, e.evaluated_on 
            FROM 
                line_manager_evaluations e 
                    JOIN users ad ON e.admin_id = ad.user_id
                    JOIN users lm ON e.line_manager_id = lm.user_id
                    JOIN performance_metrics pm ON e.metric_id = pm.metric_id
                    JOIN performance_parameters pp ON e.parameter_id = pp.parameter_id
                WHERE evaluation_id = ?;
        `;

        const evaluation = await new Promise((resolve, reject) => {
            db.query(getSingleEvaluation, [evaluation_id], (err, results) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(results[0]);
                }
            });
        });

        if(!evaluation){
            return res.status(400).send({
                success: false,
                message: "Evaluation not found"
            });
        }

        return res.status(200).send({
            success: true,
            message: "Evaluation fetch successfull",
            evaluation: evaluation
        });

    } catch (error) {
        console.log("Error while fetching single Evaluation: ", error);
        return res.status(500).send({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }

}