import React, { useEffect, useState } from "react";
import axios from "axios";
import "flowbite/dist/flowbite.css";
import { Label, TextInput } from "flowbite-react";
import img from "../assets/Image wrap.png";

const Evaluation = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [totalEvaluations, setTotalEvaluations] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/user/get-evaluations", {
          headers: { Authorization: `${token}` },
        });
  
        if (response.data.success) {
          setEvaluations(response.data.evaluations);
          setTotalEvaluations(response.data.total_evaluations);
  
          // Collect feedback from all evaluations
          const feedbackArray = response.data.evaluations.map((item) => item.feedback || "No feedback available");
  
          // Set all feedback at once
          setFeedback(feedbackArray);
          
          console.log("Evaluations:", response.data.evaluations);
          console.log("Feedback:", feedbackArray);
        }
      } catch (error) {
        console.error("Error fetching evaluations:", error);
      }
    };
  
    fetchEvaluations();
  }, []);
  

  return (
    <div className="flex-col m-4 ">
      <div className="flex-col w-full items-center space-x-4 m-3 justify-between">
        <div className="flex items-center space-x-4">
          <img src={img} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white shadow-md" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Employee Evaluations</h2>
            <p className="text-gray-500">Total Evaluations: {totalEvaluations}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row w-full mt-16 justify-between">
  <div className="m-3 lg:w-1/3">
    <h3 className="text-lg font-semibold">Evaluation Parameters</h3>
    <p className="text-sm text-gray-500">Employee performance metrics and results</p>
  </div>
  <div className="mb-6 lg:w-2/3">
    <div className="w-full bg-white p-6 rounded-lg shadow-md grid grid-cols-1 gap-4 mt-4">
      {evaluations.map((evaluation) => (
        <div key={evaluation.evaluation_id} className="flex flex-col space-y-2">
          <Label htmlFor={evaluation.metric_id} value={evaluation.metric_name} />
          <div className="flex space-x-4">
            <TextInput
              className="w-full"
              id={evaluation.metric_id}
              type="number"
              value={evaluation.marks_obtained}
              readOnly
            />
            <TextInput className="w-full" placeholder={evaluation.parameter_name} readOnly />
          </div>
          <span className="text-xs text-gray-500">Weightage: {evaluation.total_weightage}%</span>
        </div>
      ))}
    </div>
  </div>
</div>


      <div className="flex flex-col lg:flex-row w-full mt-16 justify-between">
        <div className="m-3 w-1/3">
          <h3 className="text-lg font-semibold">Feedback</h3>
          <p className="text-sm text-gray-500">Manager's feedback on performance</p>
        </div>
        <div className="lg:w-2/3 bg-white rounded-lg p-5">
          <h3 className="text-lg font-semibold">Overall Feedback</h3>
          <ul className="list-disc list-inside">
  {Array.isArray(feedback) ? (
    feedback.map((item, index) => (
      <li key={index} className="text-sm text-gray-500">
        {item}
      </li>
    ))
  ) : (
    <li className="text-sm text-gray-500">No feedback available</li>
  )}
</ul>

         </div>
      </div>
    </div>
  );
};

export default Evaluation;
