// src/components/Modal/AddEvaluationModal.jsx
import React, { useState } from "react";
import axios from "axios";
import { Modal, Button } from "flowbite-react";

const AddEvaluationModal = ({ isOpen, onClose, employeeData, parameterData }) => {
  const [marksObt, setMarksObt] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Debugging Logs
  console.log("Employee Data:", employeeData?.user_id , employeeData?.dept_ids?.[0]);
  console.log("Parameter Data:", parameterData);

  const handleAddEvaluation = async () => {
    const token = localStorage.getItem("token");

    // Validation check
    if (!token || !employeeData || !parameterData) {
      console.error("Missing required data.");
      return;
    }
    if (marksObt === "" || feedback.trim() === "") {
      alert("Please fill in all fields before submitting.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `http://localhost:8080/user/evaluate-lm`,
        {
          line_manager_id: employeeData.user_id,
          metric_id: parameterData.metric_id,
          parameter_id: parameterData.parameter_id,
          marks_obt: marksObt,
          feedback: feedback,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Evaluation added successfully!");
        onClose();
        setMarksObt("");
        setFeedback("");
      } else {
        console.error("Failed to add evaluation:", response.data.message);
        alert("Failed to add evaluation. Please try again.");
      }
    } catch (error) {
      console.error("Error adding evaluation:", error);
      alert("An error occurred while adding the evaluation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="lg"   popup
    position="center" // Center the modal
    className="backdrop:bg-black/50">
      <Modal.Header>Add Evaluation</Modal.Header>
      <Modal.Body>
        <p className="font-semibold">Evaluating: {employeeData?.full_name}</p>
        <p className="text-sm text-gray-600">Metric ID: {parameterData?.metric_id}</p>
        <p className="text-sm text-gray-600 mb-4">Parameter ID: {parameterData?.parameter_id}</p>
        
        <input
          type="number"
          placeholder="Marks Obtained"
          value={marksObt}
          onChange={(e) => setMarksObt(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-2"
        />
        <textarea
          className="w-full h-32 p-2 border border-gray-300 rounded-md"
          placeholder="Enter feedback..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button 
          onClick={handleAddEvaluation} 
          disabled={isLoading}
          className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
        >
          {isLoading ? "Saving..." : "Submit"}
        </Button>
        <Button 
          color="gray" 
          onClick={onClose} 
          className="bg-gray-400 text-white hover:bg-gray-500 focus:ring-4 focus:ring-gray-300"
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEvaluationModal;
