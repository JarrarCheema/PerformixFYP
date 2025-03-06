
import React, { useState, useEffect } from "react";
import { Modal, Button, TextInput, Label } from "flowbite-react";
import axios from "axios"; // Import axios for making API requests
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const EditDepartmentModal = ({ isOpen, onClose, departmentData }) => {
  console.log("Data:", departmentData);

  // Initialize formData with department data
  const [formData, setFormData] = useState({
    deptId: departmentData?.dept_id || "", // dept_id field
    departmentName: departmentData?.department_name || "", // Department Name field
    departmentId: departmentData?.department_id || "",
  });

  const token = localStorage.getItem("token"); // Get the token from localStorage

  // Check for token in console
  console.log('token :', token);

  // Update formData when departmentData prop changes
  useEffect(() => {
    if (departmentData) {
      setFormData({
        deptId: departmentData.dept_id, // Use dept_id from the department data
        departmentName: departmentData.department_name,
        departmentId: departmentData.department_id,
      });
    }
  }, [departmentData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Save logic - Send data to the API to update the department
  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/department/update-department/${formData.deptId}`, // Use deptId in the URL
        {
          department_name: formData.departmentName,
        },
        {
          headers: {
            Authorization: `${token}`, // Send token in the Authorization header
          },
        }
      );
      
      if (response.data.success) {
        console.log("Department updated successfully:", response.data);
        toast.success("Department updated successfully!", {
          position: "top-right",
          autoClose: 1500,
        })
        setTimeout(() => onClose(), 1500); // Close the modal after successful update
      } else {
        console.error("Failed to update department:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating department:", error);
    }
  };

  return (
    <Modal show={isOpen} size="lg" onClose={onClose} popup className="backdrop:bg-black/50">
      <Modal.Header />
      <Modal.Body>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Department</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <Label htmlFor="deptId" value="Department ID" />
            <TextInput
              id="deptId"
              name="deptId"
              value={formData.departmentId}
              placeholder="Department ID"
              required
              onChange={handleChange} // Allow changing department ID
            />
          </div>

          <div>
            <Label htmlFor="departmentName" value="Department Name" />
            <TextInput
              id="departmentName"
              name="departmentName"
              value={formData.departmentName}
              placeholder="Enter department name"
              required
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-6 space-x-3">
          <Button color="gray" onClick={onClose}>Cancel</Button>
          <Button color="blue" onClick={handleSave}>Save</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EditDepartmentModal;
