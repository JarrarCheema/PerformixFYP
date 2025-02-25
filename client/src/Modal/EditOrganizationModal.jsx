import React, { useState, useEffect } from "react";
import { Modal, Button, TextInput, Label } from "flowbite-react";
import axios from "axios";

const EditOrganizationModal = ({ isOpen, onClose, organization }) => {
  const token = localStorage.getItem("token");

  // Initialize formData with organization data
  const [formData, setFormData] = useState({
    organization_name: organization?.name || "",
    type: organization?.industry || "",
    email: organization?.email || "",
    phone: organization?.phone || "",
    start_date: organization?.startDate || "",
    address: organization?.address || "",
    webURL: organization?.website || "",
  });

  // Update formData when organization prop changes
  useEffect(() => {
    if (organization) {
      setFormData({
        organization_name: organization.name,
        type: organization.industry,
        email: organization.email,
        phone: organization.phone,
        start_date: organization.startDate,
        address: organization.address,
        webURL: organization.website,
      });
    }
  }, [organization]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    console.log("Updating organization:", formData , organization.id);
    console.log("Token:", token);
    
    try {
      const response = await axios.put(
        `http://localhost:8080/organization/update-organization/${organization.id}`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
    
          },
        }
      );
      console.log("Organization updated successfully:", response.data);
      onClose(); // Close modal after successful update
    } catch (error) {
      console.error("Error updating organization:", error);
    }
  };

  return (
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
          Edit Organization
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="organization_name" value="Organization Name" />
            <TextInput
              id="organization_name"
              name="organization_name"
              value={formData.organization_name}
              placeholder="Enter organization name"
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="type" value="Type of Industry" />
            <TextInput
              id="type"
              name="type"
              value={formData.type}
              placeholder="Enter industry type"
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
              value={formData.email}
              placeholder="Enter email address"
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="phone" value="Phone" />
            <TextInput
              id="phone"
              name="phone"
              value={formData.phone}
              placeholder="Enter phone number"
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="start_date" value="Start Date" />
            <TextInput
              id="start_date"
              name="start_date"
              type="date"
              value={formData.start_date}
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="address" value="Address" />
            <TextInput
              id="address"
              name="address"
              value={formData.address}
              placeholder="Enter address"
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="webURL" value="URL (Website)" />
            <TextInput
              id="webURL"
              name="webURL"
              value={formData.webURL}
              placeholder="Enter website URL"
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
          <Button color="blue" onClick={handleUpdate}>
            Save
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EditOrganizationModal;
