import React, { useState } from "react";
import { Modal, Button, Textarea } from "flowbite-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddEmployeeEvaluationModal = ({ isOpen, onClose, employeeId, metricId, parameterId }) => {
  const [marksObt, setMarksObt] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  // Retrieve token from localStorage
  const token = localStorage.getItem("token");

  // Submit Evaluation
  const handleSubmit = async () => {
    if (!marksObt || !feedback) {
      toast.error("Please fill all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/user/evaluate-employee",
        {
          employee_id: employeeId,
          metric_id: metricId,
          parameter_id: parameterId,
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
        toast.success("Evaluation added successfully!");
        window.alert("Evaluation added successfully!"); // Show alert
        setMarksObt("");
        setFeedback("");
        onClose();
      } else {
        toast.error(response.data.message || "Failed to add evaluation.");
      }
    } catch (error) {
      toast.error("Error submitting evaluation.");
      console.error("Error submitting evaluation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal 
        show={isOpen} 
        onClose={onClose} 
        size="md" 
        className="z-[9999]" 
        style={{ zIndex: 9999 }} // Ensure it's on top
      >
        <Modal.Header>Add Evaluation</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <p className="text-md">Employee ID: {employeeId}</p>
            <p className="text-md">Metric ID: {metricId}</p>
            <p className="text-md">Parameter ID: {parameterId}</p>
            <input
              type="number"
              className="w-full border-gray-300 rounded-md p-2"
              placeholder="Enter Marks Obtained"
              value={marksObt}
              onChange={(e) => setMarksObt(e.target.value)}
            />
            <Textarea
              placeholder="Enter feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end gap-2">
          <Button onClick={onClose} color="gray">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading} 
            color="primary" 
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default AddEmployeeEvaluationModal;
