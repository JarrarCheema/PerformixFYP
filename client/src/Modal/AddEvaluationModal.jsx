import React, { useState } from "react";
import { Modal, Button } from "flowbite-react";
import axios from "axios";

const AddEvaluationModal = ({ isOpen, onClose, employeeId, onEvaluationAdded }) => {
  const [evaluationText, setEvaluationText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddEvaluation = async () => {
    const token = localStorage.getItem("token");
    const organizationId = localStorage.getItem("selectedOrganizationId");

    if (!token || !organizationId || !employeeId) {
      console.error("Missing required data.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `http://localhost:8080/evaluation/add-evaluation`,
        {
          employee_id: employeeId,
          organization_id: organizationId,
          evaluation: evaluationText,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.data.success) {
        onClose();
        onEvaluationAdded();
        setEvaluationText("");
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
        <textarea
          className="w-full h-32 p-2 border border-gray-300 rounded-md"
          placeholder="Enter evaluation..."
          value={evaluationText}
          onChange={(e) => setEvaluationText(e.target.value)}
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
