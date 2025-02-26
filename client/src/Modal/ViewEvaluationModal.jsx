// src/components/Modal/ViewEvaluationModal.jsx
import React, { useState } from "react";
import { Modal, Button } from "flowbite-react";
import { FaPlusCircle } from "react-icons/fa";
import AddEvaluationModal from "./AddEvaluationModal";

const ViewEvaluationModal = ({ isOpen, onClose, employeeData }) => {
  const [isEvaluationModalOpen, setEvaluationModalOpen] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState(null);

  // Handle opening the AddEvaluationModal
  const handleAddEvaluation = (metric, param) => {
    // Pass both metric_id and parameter details
    setSelectedParameter({
      metric_id: metric.metric_id,
      parameter_id: param.parameter_id,
      parameter_name: param.parameter_name
    });
    setEvaluationModalOpen(true);
  };

  return (
    <>
      <Modal show={isOpen} onClose={onClose}>
        <Modal.Header>Employee Metrics</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            {employeeData && employeeData.metrics && employeeData.metrics.length > 0 ? (
              employeeData.metrics.map((metric, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800">
                    Metric: {metric.metric_name || "Unnamed Metric"}
                  </h3>
                  {metric.parameters && metric.parameters.length > 0 ? (
                    <ul className="mt-2 space-y-2">
                      {metric.parameters.map((param, idx) => (
                        <li key={idx} className="flex justify-between items-center">
                          <div>
                            <span>{param.parameter_name || "Unnamed Parameter"}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span>{param.weightage || param.evaluation || 0}%</span>
                            <FaPlusCircle
                              className="text-blue-500 size-6 cursor-pointer"
                              onClick={() => handleAddEvaluation(metric, param)}
                              title="Add Evaluation"
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No parameters available.</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No metrics available.</p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Evaluation Modal */}
      <AddEvaluationModal
        isOpen={isEvaluationModalOpen}
        onClose={() => setEvaluationModalOpen(false)}
        employeeData={employeeData}
        parameterData={selectedParameter}
      />
    </>
  );
};

export default ViewEvaluationModal;
