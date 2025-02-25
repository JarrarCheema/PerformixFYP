import React, { useState } from "react";
import axios from "axios";
import { Modal, Button, TextInput, Label } from "flowbite-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddMetrics = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    metric_name: "",
    metric_description: "",
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/performance/create-metric",
        formData,
        {
          headers: {
            Authorization: `${token}`, // Added Bearer
            "Content-Type": "application/json",
          },
        }
      );

        toast.success("Metric added successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        onClose(); // Close modal after success
    
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add metric. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <Modal
        show={isOpen}
        size="lg"
        onClose={onClose}
        popup
        className="backdrop:bg-black/50"
      >
        <Modal.Header />
        <Modal.Body>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Add Performance Metric
          </h3>
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <Label htmlFor="metric_name" value="Metric Name" />
              <TextInput
                id="metric_name"
                name="metric_name"
                placeholder="Enter metric name"
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <Label
                htmlFor="metric_description"
                value="Metric Description"
              />
              <TextInput
                id="metric_description"
                name="metric_description"
                placeholder="Enter metric description"
                required
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end mt-6 space-x-3">
            <Button color="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button color="blue" onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddMetrics;
