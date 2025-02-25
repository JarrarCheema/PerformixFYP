import React, { useState, useEffect } from "react";
import axios from "axios";
import TableMuiCustom from "../mui/TableMuiCustom";
import AddMetrics from "../Modal/AddMetrics";
import EditMetrics from "../Modal/EditMetrics";
import AddParameter from "../Modal/AddParameter";
import EditParameter from "../Modal/EditParameter";
import ViewParameter from "../Modal/ViewParameter";
import { BsPlusCircle, BsEye } from "react-icons/bs";
import { FiMoreVertical } from "react-icons/fi";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ShowLineMangerDepartment from "../Modal/ShowLineMangerDepartment";

const SetMetrics = () => {
  const [isAddMetricsOpen, setIsAddMetricsOpen] = useState(false);
  const [isEditMetricsOpen, setIsEditMetricsOpen] = useState(false);
  const [isAddParameterOpen, setIsAddParameterOpen] = useState(false);
  const [isEditParameterOpen, setIsEditParameterOpen] = useState(false);
  const [isViewParameterOpen, setIsViewParameterOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRowId, setCurrentRowId] = useState(null);
  const [metricsData, setMetricsData] = useState([]); // Store fetched metrics
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [isShowLineMangerOpen, setIsShowLineMangerOpen] = useState(false);
const [selectedMetricId, setSelectedMetricId] = useState(null);

  // Table headers
  const tableHeaders = {
    metrics: "Performance Metrics",
    parameter: "Parameter",
    action: "Action",
  };

  // Fetch Metrics Data
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    const fetchMetrics = async () => {
      try {
        const response = await axios.get("http://localhost:8080/performance/get-metrics", {
          headers: {
            Authorization: `${token}`,
          },
        });
        console.log("response", response);  
        
        if (response.data.success) {
          const formattedData = response.data.metrics.map((metric) => ({
            id: metric.metric_id,
            metrics: metric.metric_name,
          }));
          setMetricsData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    fetchMetrics();
  }, []);

  // Handle Menu Open
  const handleMenuOpen = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setCurrentRowId(rowId);
  };
  const handleShowLineManger = (metricId) => {
    setSelectedMetricId(metricId);
    setIsShowLineMangerOpen(true);
  };
const handleMenuOpen2 = (event, rowId) => {
  setAnchorEl2(event.currentTarget);
  setCurrentRowId(rowId);
}
  // Handle Menu Close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentRowId(null);
  };

  // Handle Edit Metrics
  const handleEdit = () => {
    const selected = metricsData.find((row) => row.id === currentRowId);
    setSelectedMetric(selected);
    setIsEditMetricsOpen(true);
    handleMenuClose();
  };

  // Handle Delete Metrics
  const handleDelete =  async (id) => {
    alert(`Delete Metric with ID: ${id}`);

    const token = localStorage.getItem("token");
    
try {
  const response = await axios.delete(`http://localhost:8080/performance/delete-metric/${id}` ,
    {
      headers: {
        Authorization: `${token}`,
      },
    }
  );
  if (response.data.success) {
    console.log("Metric deleted successfully:", response.data);
  } else {
    console.error("Failed to delete metric:", response.data.message);
  }
  
} catch (error) {
  console.error("Error deleting metric:", error);
  
}
    handleMenuClose();
  };

  // Handle Parameter Actions
  const handleAddParameter = (row) => {
    setSelectedMetric(row);
    setIsAddParameterOpen(true);
  };

  const handleViewParameter = (parameter) => {
    setSelectedParameter(parameter);
    setIsViewParameterOpen(true);
  };

  const handleEditParameter = (parameter) => {
    setSelectedParameter(parameter);
    setIsEditParameterOpen(true);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Manage your performance metrics here
        </h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={() => setIsAddMetricsOpen(true)}
        >
          + Add Metrics
        </button>
      </div>

      {/* Table Component */}
      <TableMuiCustom
        th={tableHeaders}
        td={metricsData
          .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
          .map((row) => ({
            ...row,
            parameter: (
              <div className="flex gap-4 text-2xl text-gray-600 font-bold">
                <BsPlusCircle
                  className="cursor-pointer"
                  title="Add Parameter"
                  onClick={() => handleAddParameter(row)}
                />
                <BsEye
                  className="cursor-pointer"
                  title="View Parameter"
                  onClick={() => handleViewParameter(row)}
                />
                {/* <FiMoreVertical
                  className="cursor-pointer"
                  title="More Actions"
                  onClick={(event) => handleMenuOpen2(event, row.id)}
                /> */}
                <Menu
                  anchorEl={anchorEl2}
                  open={Boolean(anchorEl2) && currentRowId === row.id}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => handleEditParameter(row)}>
                    Edit
                  </MenuItem>
                  <MenuItem onClick={() => handleDelete(row.id)}>
                    Delete
                  </MenuItem>
                </Menu>
              </div>
            ),
            action: (
              <> 
              <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl) && currentRowId === row.id}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => handleEdit(row)}>
                Edit Metrics
              </MenuItem>
              <MenuItem onClick={() => handleShowLineManger(row)}>
                Asign Metrics
              </MenuItem>
              <MenuItem onClick={() => handleDelete(row.id)}>
                Delete
              </MenuItem>
            </Menu>
              <FiMoreVertical
                className="text-2xl cursor-pointer"
                onClick={(event) => handleMenuOpen(event, row.id)}
              />
              </>
            ),
          }))}
        styleTableContainer={{ boxShadow: "none", borderRadius: "10px" }}
        styleTableThead={{ backgroundColor: "#F8F9FA" }}
        styleTableTh={{ fontWeight: "bold", color: "#333", fontSize: "19px" }}
        styleTableTbody={{ backgroundColor: "#FFFFFF" }}
        cellStyles={{
          metrics: { fontWeight: "500", color: "#555", fontSize: "18px" },
          parameter: { fontSize: "19px", color: "#444" },
          action: { fontSize: "18px", color: "#444" },
        }}
        rowStyles={{
          backgroundColor: "#FFFFFF",
          fontSize: "24px",
          color: "#333",
        }}
        headerRounded={true}
        rowRounded={true}
      />

      {/* Add Metrics Modal */}
      {isAddMetricsOpen && (
        <AddMetrics
          isOpen={isAddMetricsOpen}
          onClose={() => setIsAddMetricsOpen(false)}
        />
      )}

      {/* Edit Metrics Modal */}
      {isEditMetricsOpen && selectedMetric && (
        <EditMetrics
          isOpen={isEditMetricsOpen}
          onClose={() => setIsEditMetricsOpen(false)}
          departmentData={selectedMetric}
        />
      )}
      {console.log("selectedMetric", selectedMetric)}
      

      {/* Add Parameter Modal */}
      {isAddParameterOpen && (
        <AddParameter
          isOpen={isAddParameterOpen}
          onClose={() => setIsAddParameterOpen(false)}
          id={selectedMetric.id}
        />
      )}

      {/* Edit Parameter Modal */}
      {isEditParameterOpen && selectedParameter && (
        <EditParameter
          isOpen={isEditParameterOpen}
          onClose={() => setIsEditParameterOpen(false)}
          parameterData={selectedParameter}
        />
      )}

      {/* View Parameter Modal */}
      {isViewParameterOpen && selectedParameter && (
        <ViewParameter
          isOpen={isViewParameterOpen}
          onClose={() => setIsViewParameterOpen(false)}
          parameterData={selectedParameter}
        />
      )}
<ShowLineMangerDepartment
  isOpen={isShowLineMangerOpen}
  onClose={() => setIsShowLineMangerOpen(false)}
  id={selectedMetricId}
/>

    </div>
  );
};

export default SetMetrics;
