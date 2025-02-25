import React, { useState } from "react";
import { Modal, Button, TextInput, Label } from "flowbite-react";
import axios from "axios"; // Import axios
import AddEmployeeModal from "./AddEmployeeModal"; // Import Employee Modal
import { toast } from "react-toastify"; // Import toast from react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toastify

const AddDepartmentModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    department: "",
    departmentId: "", // State for department ID
  });

  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false); // State for Employee Modal

  // Retrieve the token and organization ID from localStorage
  const token = localStorage.getItem("token");
  const organizationId = localStorage.getItem("selectedOrganizationId"); // Assuming the selected organization ID is saved with this key
console.log(token , organizationId);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Save (Submit the form)
  const handleSave = async () => {
    if (!formData.department || !formData.departmentId) {
      toast.error("Please fill out all fields."); // Show error toast
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/department/create-department", 
        {
          department_name: formData.department,
          department_id: formData.departmentId, // Use the entered department ID
          organization_id: organizationId,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Department created successfully"); // Show success toast
        onClose(); // Close modal after success
      } else {
        toast.error("Failed to create department: " + response.data.message); // Show error toast
      }
    } catch (error) {
      console.error("Error creating department:", error);
      toast.error("An error occurred while creating the department."); // Show error toast
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
            Add Department
          </h3>
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <Label htmlFor="department" value="Department Name" />
              <TextInput
                id="department"
                name="department"
                placeholder="ZAPTA Technologies"
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="departmentId" value="Department ID" />
              <TextInput
                id="departmentId"
                name="departmentId"
                placeholder="Unique Department ID"
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <button
                className="font-bold text-blue-600 bg-blue-100 hover:bg-blue-200 py-2 px-4 rounded-lg"
                onClick={() => setIsEmployeeModalOpen(true)} // Open Employee Modal
              >
                + Add Employee
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end mt-6 space-x-3">
            <Button color="gray" onClick={onClose}>Cancel</Button>
            <Button color="blue" onClick={handleSave}>Save</Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Add Employee Modal */}
      <AddEmployeeModal 
        isOpen={isEmployeeModalOpen} 
        onClose={() => setIsEmployeeModalOpen(false)} 
      />
    </>
  );
};

export default AddDepartmentModal;
