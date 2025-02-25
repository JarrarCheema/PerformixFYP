import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import PaginatedTable from "../Flowbite/PaginatedTable";
import AddOrganizationModal from "../Modal/AddOrganizationModal";
import EditOrganizationModal from "../Modal/EditOrganizationModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrgDetails = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const token = localStorage.getItem("token");

  // Fetching data from backend using useCallback for memoization
  const fetchOrganizations = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/organization/get-organizations",
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Fetched Organizations:", response.data);
      // Mapping the response to table format
      const orgData = response.data.organizations.map((org) => ({
        id: org.organization_id,
        name: org.organization_name,
        industry: org.type,
        email: org.email,
        phone: org.phone,
        address: org.address,
        website: org.webURL,
        employees: org.employee_count,
      }));
      setOrganizations(orgData);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  }, [token]);

  // Call fetchOrganizations once on component mount
  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  // Column definitions with ID column added
  const columns = [
    { header: "ID", accessor: "id", key: "id" },
    { header: "Organization Name", accessor: "name", key: "name" },
    { header: "Type of Industry", accessor: "industry", key: "industry" },
    { header: "Email Address", accessor: "email", key: "email" },
    { header: "Phone", accessor: "phone", key: "phone" },
    { header: "Address", accessor: "address", key: "address" },
    { header: "URL (Website)", accessor: "website", key: "website" },
    { header: "Total Employees", accessor: "employees", key: "employees" },
    { header: "Action", accessor: "action", isAction: true, key: "action" },
  ];

  const handleEdit = useCallback((organization) => {
    setSelectedOrg(organization);
    console.log("Edit organization:", organization);
    setEditModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (organization) => {
      const confirmDelete = window.confirm(
        `Are you sure you want to delete the organization "${organization.name}"?`
      );

      if (confirmDelete) {
        try {
          await axios.delete(
            `http://localhost:8080/organization/delete-organization/${organization.id}`,
            {
              headers: {
                Authorization: `${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          console.log("Deleted organization:", organization);
          setOrganizations((prevOrgs) =>
            prevOrgs.filter((org) => org.id !== organization.id)
          );
          toast.success("Organization deleted successfully!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
          });
        } catch (error) {
          console.error("Error deleting organization:", error);
          toast.error("Failed to delete organization. Please try again.", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
          });
        }
      } else {
        console.log("Deletion canceled for:", organization);
      }
    },
    [token]
  );

  const handleAddOrganization = useCallback(() => {
    setModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    fetchOrganizations(); // Refresh list after adding or editing
  }, [fetchOrganizations]);

  const handleEditModalClose = useCallback(() => {
    setEditModalOpen(false);
    fetchOrganizations(); // Refresh list after editing
  }, [fetchOrganizations]);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <ToastContainer />
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Organization Details</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={handleAddOrganization}
        >
          + Add Organization
        </button>
      </div>

      {/* Paginated Table Component */}
      <PaginatedTable
        data={organizations}
        columns={columns}
        row={10}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add and Edit Modals */}
      <AddOrganizationModal isOpen={isModalOpen} onClose={handleModalClose} />
      <EditOrganizationModal
        isOpen={editModalOpen}
        onClose={handleEditModalClose}
        organization={selectedOrg}
      />
    </div>
  );
};

export default OrgDetails;
