import React, { useState, useEffect } from "react";
import { Modal, Button, TextInput, Label } from "flowbite-react";
import axios from "axios";

const EditMetrics = ({ isOpen, onClose, departmentData }) => {
  console.log("Data:", departmentData.id);

  // Initialize formData with department data
  const [formData, setFormData] = useState({
    metric_name: departmentData?.metrics || "",
    metric_description: "",
  });

  // Update formData when departmentData prop changes
  useEffect(() => {
    if (departmentData) {
      setFormData({
        metric_name: departmentData.metrics,
        metric_description: "",
      });
    }
  }, [departmentData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Update
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8080/performance/update-metric/${departmentData.id}`,
        {
          metric_name: formData.metric_name,
          metric_description: formData.metric_description,
        },
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        alert("Metric updated successfully!");
        onClose();
      } else {
        alert("Failed to update metric.");
      }
    } catch (error) {
      console.error("Error updating metric:", error);
      alert("An error occurred while updating the metric.");
    }
  };

  return (
    <Modal show={isOpen} size="lg" onClose={onClose} popup className="backdrop:bg-black/50">
      <Modal.Header />
      <Modal.Body>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Performance Metric</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <Label htmlFor="metric_name" value="Metric Name" />
            <TextInput
              id="metric_name"
              name="metric_name"
              value={formData.metric_name}
              placeholder="Enter metric name"
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="metric_description" value="Metric Description" />
            <TextInput
              id="metric_description"
              name="metric_description"
              value={formData.metric_description}
              placeholder="Enter metric description"
              required
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-6 space-x-3">
          <Button color="gray" onClick={onClose}>Cancel</Button>
          <Button color="blue" onClick={handleUpdate}>Save</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EditMetrics;
