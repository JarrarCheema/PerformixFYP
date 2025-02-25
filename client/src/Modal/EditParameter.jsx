import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, TextInput, Label } from "flowbite-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditParameter = ({ isOpen, onClose, parameterData }) => {
  const [formData, setFormData] = useState({
    ParameterName: "",
    Description: "",
  });

  const token = localStorage.getItem("token");


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    if (parameterData) {
      setFormData({
        ParameterName: parameterData.parameter_name || "",
        Description: parameterData.parameter_description || "",
      });
    }
  }, [parameterData]);
  
  const handleSubmit = async () => {
    const parameter_id=parameterData.parameter_id;
    try {
      await axios.put(
        `http://localhost:8080/performance/edit-parameter/${parameter_id}`,
        {
          parameter_name: formData.ParameterName,
          parameter_description: formData.Description,
        },
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      toast.success("Parameter updated successfully!", {
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
      toast.error("Failed to update parameter. Please try again.", {
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
            Edit Parameter
          </h3>
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <Label htmlFor="ParameterName" value="Parameter Name" />
              <TextInput
                id="ParameterName"
                name="ParameterName"
                placeholder="Enter parameter name"
                value={formData.ParameterName}
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="Description" value="Description" />
              <TextInput
                id="Description"
                name="Description"
                placeholder="Enter description"
                value={formData.Description}
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
              Update
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditParameter;
