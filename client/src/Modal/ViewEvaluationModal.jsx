// src/components/Modal/ViewEvaluationModal.jsx
import React, { useEffect, useState } from "react";
import { Modal, Button } from "flowbite-react";
import axios from "axios";

const ViewEvaluationModal = ({ isOpen, onClose, employeeId }) => {
  const [evaluation, setEvaluation] = useState("");

  // Fetch Evaluation Details
  const fetchEvaluation = async () => {
    const token = localStorage.getItem("token");
    const organizationId = localStorage.getItem("selectedOrganizationId");

    try {
      const response = await axios.get(
        `http://localhost:8080/evaluation/get/${employeeId}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.data.success) {
        setEvaluation(response.data.evaluation);
      } else {
        console.error("Failed to fetch evaluation:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching evaluation:", error);
    }
  };

  useEffect(() => {
    if (isOpen && employeeId) {
      fetchEvaluation();
    }
  }, [isOpen, employeeId]);

  return (
    <Modal show={isOpen} onClose={onClose}>
      <Modal.Header>Employee Evaluation</Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          {evaluation ? (
            <p className="text-gray-700">{evaluation}</p>
          ) : (
            <p className="text-gray-500">No evaluation available.</p>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button color="gray" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewEvaluationModal;
