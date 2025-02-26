import React, { useState } from "react";
import { Modal, Button, TextInput, Label } from "flowbite-react";
import axios from "axios";
import AddEmployeeModal from "./AddEmployeeModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddDepartmentModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    department: "",
    departmentId: "",
  });

  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);

  const token = localStorage.getItem("token");
  const organizationId = localStorage.getItem("selectedOrganizationId");
  console.log(token, organizationId);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!formData.department || !formData.departmentId) {
      toast.error("Please fill out all fields.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/department/create-department",
        {
          department_name: formData.department,
          department_id: formData.departmentId,
          organization_id: organizationId,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Department created successfully");
        onClose();
      } else {
        toast.error("Failed to create department: " + response.data.message);
      }
    } catch (error) {
      console.error("Error creating department:", error);
      toast.error("An error occurred while creating the department.");
    }
  };

  return (
    <>
      <Modal
        show={isOpen}
        size="lg"
        onClose={onClose}
        popup
        position="center" // Center the modal
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
                onClick={() => setIsEmployeeModalOpen(true)}
              >
                + Add Employee
              </button>
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-3">
            <Button color="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button color="blue" onClick={handleSave}>
              Save
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <AddEmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
      />
    </>
  );
};

export default AddDepartmentModal;
