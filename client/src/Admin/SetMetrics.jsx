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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [metricsData, setMetricsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [isShowLineMangerOpen, setIsShowLineMangerOpen] = useState(false);
  const [selectedMetricId, setSelectedMetricId] = useState(null);

  const fetchMetrics = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:8080/performance/get-metrics", {
        headers: { Authorization: `${token}` },
      });
      if (response.data.success) {
        const formattedData = response.data.metrics.map((metric) => ({
          id: metric.metric_id,
          metrics: metric.metric_name,
        }));
        setMetricsData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching metrics:", error);
      toast.error("Error fetching metrics!", { position: "top-right", autoClose: 3000 });
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [1500]);

  const handleMenuOpen = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setCurrentRowId(rowId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentRowId(null);
  };

  const handleEdit = async () => {
    const selected = metricsData.find((row) => row.id === currentRowId);
    setSelectedMetric(selected);
    setIsEditMetricsOpen(true);
    handleMenuClose();
    fetchMetrics();
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(`http://localhost:8080/performance/delete-metric/${id}`, {
        headers: { Authorization: `${token}` },
      });
      if (response.data.success) {
        toast.success("Metric deleted successfully!", { position: "top-right", autoClose: 3000 });
        fetchMetrics();
      }
    } catch (error) {
      console.error("Error deleting metric:", error);
    }
    handleMenuClose();
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Manage your performance metrics here</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={() => setIsAddMetricsOpen(true)}>
          + Add Metrics
        </button>
      </div>
      <TableMuiCustom
        th={{ metrics: "Performance Metrics", parameter: "Parameter", action: "Action" }}
        td={metricsData.map((row) => ({
          ...row,
          parameter: (
            <div className="flex gap-4 text-2xl text-gray-600 font-bold">
              <BsPlusCircle title="Add Parameter" onClick={() => setIsAddParameterOpen(true)} />
              <BsEye title="View Parameter" onClick={() => setIsViewParameterOpen(true)} />
            </div>
          ),
          action: (
            <>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl) && currentRowId === row.id} onClose={handleMenuClose}>
                <MenuItem onClick={() => handleEdit(row)}>Edit Metrics</MenuItem>
                <MenuItem onClick={() => handleDelete(row.id)}>Delete</MenuItem>
              </Menu>
              <FiMoreVertical className="text-2xl cursor-pointer" onClick={(event) => handleMenuOpen(event, row.id)} />
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
      />

      {isAddMetricsOpen && <AddMetrics isOpen={isAddMetricsOpen} onClose={() => setIsAddMetricsOpen(false)} fetchMetrics={fetchMetrics} />}
      {isEditMetricsOpen && <EditMetrics isOpen={isEditMetricsOpen} onClose={() => setIsEditMetricsOpen(false)} fetchMetrics={fetchMetrics} departmentData={selectedMetric} />}
      {isAddParameterOpen && <AddParameter isOpen={isAddParameterOpen} onClose={() => setIsAddParameterOpen(false)} id={selectedMetric?.id} fetchMetrics={fetchMetrics} />}
      {isEditParameterOpen && <EditParameter isOpen={isEditParameterOpen} onClose={() => setIsEditParameterOpen(false)} parameterData={selectedParameter} fetchMetrics={fetchMetrics} />}
      {isViewParameterOpen && <ViewParameter isOpen={isViewParameterOpen} onClose={() => setIsViewParameterOpen(false)} parameterData={selectedParameter} />}
      <ShowLineMangerDepartment isOpen={isShowLineMangerOpen} onClose={() => setIsShowLineMangerOpen(false)} id={selectedMetricId} />
    </div>
  );
};

export default SetMetrics;
