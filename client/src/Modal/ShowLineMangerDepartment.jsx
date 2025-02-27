import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Label, Select, TextInput } from "flowbite-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShowLineMangerDepartment = ({ isOpen, onClose, id }) => {
  const [lineManagers, setLineManagers] = useState([]);
  const [selectedLM, setSelectedLM] = useState(null);
  const [metricData, setMetricData] = useState({
    metric_id: "",
    department_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  const organizationId = localStorage.getItem("selectedOrganizationId");
  const organization_id = organizationId;

  // Fetch Line Managers and Departments
  useEffect(() => {
    const fetchLineManagers = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          `http://localhost:8080/user/get-all-LMs/${organization_id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (response.data.success) {
          setLineManagers(response.data.Line_Managers);
        } else {
          toast.error("Failed to fetch data. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching Line Managers:", error);
        toast.error("Failed to fetch data. Please try again.");
      }
    };

    if (isOpen) {
      fetchLineManagers();
    }
  }, [isOpen, id]);

  // Handle input change for metric form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMetricData({
      ...metricData,
      [name]: value,
    });
  };

  // Open Assign Metric Modal
  const openAssignModal = (lm) => {
    console.log("Selected Line Manager:", lm);
  
    setSelectedLM(lm);
    setMetricData({
      metric_id: id.metrics || "",
      department_id: lm.dept_ids[0].toString() || "", // Convert to string for single value
    });
    setAssignModalOpen(true);
  };
  

  // Handle Metric Assignment
  const handleAssignMetric = async () => {
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token || !selectedLM) {
      toast.error("Required data missing.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/performance/assign-metric`,
        {
          metric_id: id.id,
          line_manager_id: selectedLM.user_id,
          department_id: metricData.department_id,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Metric assigned successfully!");
        setAssignModalOpen(false);
      } else {
        toast.error("Failed to assign metric. Try again.");
      }
    } catch (error) {
      console.error("Error assigning metric:", error);
    
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.message || "Bad Request.";
        toast.error(errorMessage);
        setAssignModalOpen(false);
      } else {
        toast.error("Error assigning metric. Please try again.");
      }
    } 
    
  };

  return (
    <>
      <ToastContainer />
      <Modal show={isOpen} onClose={onClose} popup={true} size="lg">
        <Modal.Header className="text-center">Line Managers</Modal.Header>
        <Modal.Body>
          {lineManagers.length > 0 ? (
            <div className="space-y-4">
              {lineManagers.map((lm) => (
                <div
                  key={lm.user_id}
                  className="border rounded-lg p-4 shadow-md flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {lm.full_name} ({lm.user_name})
                    </h3>
                    <p className="text-gray-600">{lm.designation}</p>

                    {/* Display Departments */}
                    <p className="text-gray-800 font-semibold mt-2">
                      Departments:
                    </p>
                    {lm.departments && lm.departments.length > 0 ? (
                      <ul className="list-disc list-inside text-gray-600">
                        {lm.departments.map((dept, index) => (
                          <li key={index}>{dept}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">No departments assigned.</p>
                    )}
                  </div>

                  <Button color="blue" onClick={() => openAssignModal(lm)}>
                    Assign Metric
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No Line Managers available.</p>
          )}
        </Modal.Body>
      </Modal>

      {/* Assign Metric Modal */}
      <Modal
        show={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        popup={true}
        size="md"
      >
        <Modal.Header className="text-center">Assign Metric</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <Label htmlFor="metric_id" value="Metric ID" />
              <TextInput
                id="metric_id"
                name="metric_id"
                placeholder="Enter Metric ID"
                required
                onChange={handleChange}
                value={metricData.metric_id}
              />
            </div>
            <div>
              <Label htmlFor="department_id" value="Department" />
              <Select
                id="department_id"
                name="department_id"
                required
                onChange={handleChange}
                value={metricData.department_id}
              >
                {selectedLM &&
                  selectedLM.department_ids.map((deptId, index) => (
                    <option key={index} value={deptId}>
                      {selectedLM.departments[index]}
                    </option>
                  ))}
              </Select>
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-3">
            <Button
              color="gray"
              onClick={() => setAssignModalOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              color="blue"
              onClick={handleAssignMetric}
              disabled={loading}
            >
              {loading ? "Assigning..." : "Assign Metric"}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ShowLineMangerDepartment;
