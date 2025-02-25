import React, { useState } from "react";
import { Modal, Button, TextInput, Label } from "flowbite-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddEmployeeModal = ({ isOpen, onClose, selectedDepartment }) => {
  console.log("Selected department:", selectedDepartment);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    role_id: "",
    designation: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "role_id" ? parseInt(value, 10) || "" : value,
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);

    const token = localStorage.getItem("token");

    if (!token || !selectedDepartment) {
      console.error("Token or Department ID missing.");
      setLoading(false);
      toast.error("Token or Department ID missing.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/user/register-employee",
        { ...formData, department_id: selectedDepartment },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.data.success) {
        console.log("Employee added successfully:", response.data);
        toast.success("Employee added successfully!");
      
      } else {
        console.error("Failed to add employee:", response.data.message);
        toast.error("Failed to add employee.");
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Error adding employee.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
            Add Employee
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name" value="Full Name" />
              <TextInput
                id="full_name"
                name="full_name"
                placeholder="Enter full name"
                required
                onChange={handleChange}
                value={formData.full_name}
              />
            </div>
            <div>
              <Label htmlFor="email" value="Email Address" />
              <TextInput
                id="email"
                name="email"
                type="email"
                placeholder="Enter email"
                required
                onChange={handleChange}
                value={formData.email}
              />
            </div>
            <div>
              <Label htmlFor="role_id" value="User Role" />
              <TextInput
                id="role_id"
                name="role_id"
                type="number"
                placeholder="Enter role (e.g., Admin, Developer)"
                required
                onChange={handleChange}
                value={formData.role_id}
              />
            </div>
            <div>
              <Label htmlFor="designation" value="Designation" />
              <TextInput
                id="designation"
                name="designation"
                placeholder="Enter designation (e.g., Manager, Engineer)"
                required
                onChange={handleChange}
                value={formData.designation}
              />
            </div>
            <div>
              <Label htmlFor="phone" value="Phone" />
              <TextInput
                id="phone"
                name="phone"
                placeholder="Enter phone number"
                required
                onChange={handleChange}
                value={formData.phone}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end mt-6 space-x-3">
            <Button color="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button color="blue" onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default AddEmployeeModal;
