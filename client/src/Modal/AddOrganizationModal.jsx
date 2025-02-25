import React, { useState } from "react";
import { Modal, Button, TextInput, Label } from "flowbite-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddOrganizationModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    email: "",
    phone: "",
    startDate: "",
    address: "",
    website: "",
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/organization/create-organization",
        {
          name: formData.name,
          type: formData.industry,
          email: formData.email,
          phone: formData.phone,
          startDate: formData.startDate,
          address: formData.address,
          webURL: formData.website,
        },
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Organization created:", response.data);
      toast.success("Organization created successfully!", {
        position: "top-right",
      });
      onClose(); // Close the modal on success
    } catch (error) {
      console.error("Error creating organization:", error);
      toast.error("Failed to create organization. Please try again.", {
        position: "top-right",
      });
    }
  };

  return (
    <>
      <Modal 
        show={isOpen} 
        size="xl" 
        onClose={onClose} 
        popup 
        className="backdrop:bg-black/50"
      >
        <Modal.Header />
        <Modal.Body>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Add Organization
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" value="Name" />
              <TextInput 
                id="name" 
                name="name" 
                placeholder="At least 8 characters" 
                required 
                onChange={handleChange} 
              />
            </div>
            <div>
              <Label htmlFor="industry" value="Type of Industry" />
              <TextInput 
                id="industry" 
                name="industry" 
                placeholder="At least 8 characters" 
                required 
                onChange={handleChange} 
              />
            </div>
            <div>
              <Label htmlFor="email" value="Email Address" />
              <TextInput 
                id="email" 
                name="email" 
                type="email" 
                placeholder="At least 8 characters" 
                required 
                onChange={handleChange} 
              />
            </div>
            <div>
              <Label htmlFor="phone" value="Phone" />
              <TextInput 
                id="phone" 
                name="phone" 
                placeholder="At least 8 characters" 
                required 
                onChange={handleChange} 
              />
            </div>
            <div>
              <Label htmlFor="startDate" value="Start Date" />
              <TextInput 
                id="startDate" 
                name="startDate" 
                type="date" 
                required 
                onChange={handleChange} 
              />
            </div>
            <div>
              <Label htmlFor="address" value="Address" />
              <TextInput 
                id="address" 
                name="address" 
                placeholder="At least 8 characters" 
                required 
                onChange={handleChange} 
              />
            </div>
            <div>
              <Label htmlFor="website" value="URL (Website)" />
              <TextInput 
                id="website" 
                name="website" 
                placeholder="At least 8 characters" 
                required 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-3">
            <Button color="gray" onClick={onClose}>Cancel</Button>
            <Button color="blue" onClick={handleSubmit}>Save</Button>
          </div>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default AddOrganizationModal;
