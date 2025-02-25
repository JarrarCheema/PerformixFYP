import React, { useState } from "react";
import axios from "axios";
import { Modal, Button, TextInput, Label } from "flowbite-react";
import { ToastContainer,toast } from "react-toastify";

const AddParameter = ({ isOpen, onClose, id }) => {
  console.log("id", id);

  const [formData, setFormData] = useState({
    parameter_name: "",
    parameter_description: "",
    weightage: "",
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        `http://localhost:8080/performance/create-parameter/${id}`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Parameter added successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      // Reset Form Data
      setFormData({
        parameter_name: "",
        parameter_description: "",
        weightage: "",
      });

   
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add parameter. Please try again.", {
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
            Add Parameter
          </h3>
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <Label htmlFor="parameter_name" value="Parameter Name" />
              <TextInput
                id="parameter_name"
                name="parameter_name"
                placeholder="Enter parameter name"
                required
                value={formData.parameter_name}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="parameter_description" value="Description" />
              <TextInput
                id="parameter_description"
                name="parameter_description"
                placeholder="Enter description"
                required
                value={formData.parameter_description}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="weightage" value="Weightage" />
              <TextInput
                id="weightage"
                name="weightage"
                placeholder="Enter weightage"
                type="number"
                required
                value={formData.weightage}
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

export default AddParameter;
