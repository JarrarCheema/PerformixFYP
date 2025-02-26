// src/components/Modal/AddEvaluationModal.jsx
import React, { useState } from "react";
import axios from "axios";
import { Modal, Button } from "flowbite-react";

const AddEvaluationModal = ({ isOpen, onClose, employeeData, parameterData }) => {
  const [marksObt, setMarksObt] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Console Logs for Debugging
  console.log("Employee Data:", employeeData);
  console.log("Parameter Data:", parameterData);

  const handleAddEvaluation = async () => {
    const token = localStorage.getItem("token");

    if (!token || !employeeData || !parameterData) {
      console.error("Missing required data.");
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
        onClose();
        setMarksObt("");
        setFeedback("");
      } else {
        console.error("Failed to add evaluation:", response.data.message);
      }
    } catch (error) {
      console.error("Error adding evaluation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="lg">
      <Modal.Header>Add Evaluation</Modal.Header>
      <Modal.Body>
        <p>Evaluating: {employeeData?.full_name}</p>
        <p>Metric ID: {parameterData?.metric_id}</p>
        <p>Parameter ID: {parameterData?.parameter_id}</p>
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
        <Button onClick={handleAddEvaluation} disabled={isLoading}>
          {isLoading ? "Saving..." : "Add Evaluation"}
        </Button>
        <Button color="gray" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEvaluationModal;
