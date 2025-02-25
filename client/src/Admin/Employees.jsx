import React, { useState, useEffect } from "react";
import { HiSearch, HiX } from "react-icons/hi";
import PaginatedTable from "../Flowbite/PaginatedTable";
import AddEmployeeModal from "../Modal/AddEmployeeModal";
import axios from "axios";
import { FaHouseChimneyMedical } from "react-icons/fa6";
import AddEvaluationModal from "../Modal/AddEvaluationModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRegEye } from "react-icons/fa";
import ViewEvaluationModal from "../Modal/ViewEvaluationModal";

const Employees = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [isDepartmentDropdownVisible, setIsDepartmentDropdownVisible] = useState(false);
  const [isEvaluationModalOpen, setEvaluationModalOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(10);

  // Fetch Employees from API
  const fetchEmployees = async () => {
    const token = localStorage.getItem("token");
    const organizationId = localStorage.getItem("selectedOrganizationId");

    if (!token || !organizationId) {
      console.error("No token or organizationId found in localStorage.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/user/get-employees/${organizationId}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.data.success) {
        setEmployees(response.data.Employees);
      } else {
        console.error("Failed to fetch employees:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Fetch Departments from API
  const fetchDepartments = async () => {
    const token = localStorage.getItem("token");
    const organizationId = localStorage.getItem("selectedOrganizationId");

    if (!token) {
      console.error("No token found in localStorage.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/department/get-departments/${organizationId}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.data.success) {
        setDepartments(response.data.departments);
      } else {
        console.error("Failed to fetch departments:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  // Add Employee API Call
  const addEmployee = async (employeeData) => {
    const token = localStorage.getItem("token");
    const organizationId = localStorage.getItem("selectedOrganizationId");

    try {
      const response = await axios.post(
        `http://localhost:8080/user/add-employee`,
        { 
          ...employeeData, 
          organization_id: organizationId,
          department_id: selectedDepartment 
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.data.success) {
        setModalOpen(false);
        setSelectedDepartment(null);
        fetchEmployees();
      } else {
        console.error("Failed to add employee:", response.data.message);
      }
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  // Column definitions with conditional Evaluation column
  const columns = [
    { header: "Username", accessor: "user_name", key: "user_name" },
    { header: "Full Name", accessor: "full_name", key: "full_name" },
    { header: "Designation", accessor: "designation", key: "designation" },
    { header: "Department", accessor: "department", key: "department" },
    {
      header: "Evaluation",
      accessor: "evaluation",
      key: "evaluation",
      condition: (emp) => emp.designation === "Line Manager"
    },
    { header: "Action", accessor: "action", isAction: true, key: "action" },
  ];

  // Handle Department Selection
  const handleDepartmentSelect = (deptId) => {
    setSelectedDepartment(deptId);
    setIsDepartmentDropdownVisible(false);
    setModalOpen(true);
  };

  // Filtered data and conditional Evaluation column
  const filteredData = employees
    .filter((emp) =>
      emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.user_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((emp) => ({
      ...emp,
      evaluation:
        emp.designation === "Line Manager" ? emp.evaluation || <div className="flex space-x-2"><FaHouseChimneyMedical className="text-red-500 size-6 cursor-pointer"  onClick={() => {
          setSelectedEmployeeId(emp.user_id);
          setEvaluationModalOpen(true);
        }}/>
        <FaRegEye className="text-gray-500 size-6 cursor-pointer" onClick={() => {setShowEvaluation(true);
setSelectedEmployeeId(emp.user_id);
         } }/></div> : <FaRegEye className="text-gray-500 size-6 cursor-pointer" onClick={()=>{
          setShowEvaluation(true);
          setSelectedEmployeeId(emp.user_id);
         }}/>,
    }));

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Employee Management</h2>
        <div className="flex items-center space-x-2">
          <div className="relative w-72">
            <HiSearch className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {searchTerm && (
              <HiX
                className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                onClick={() => setSearchTerm("")}
              />
            )}
          </div>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={() => {
              setIsAddingEmployee(true);
              setIsDepartmentDropdownVisible(true);
            }}
          >
            + Add Employee
          </button>
        </div>
      </div>

      {isAddingEmployee && isDepartmentDropdownVisible && (
        <div className="mb-4">
          <label className="font-semibold">Select Department</label>
          <select
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg"
            onChange={(e) => handleDepartmentSelect(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>Select a department</option>
            {departments.map((dept) => (
              <option key={dept.dept_id} value={dept.dept_id}>
                {dept.department_name}
              </option>
            ))}
          </select>
        </div>
      )}

      <PaginatedTable
        data={filteredData}
        columns={columns.filter(col => 
          !col.condition || employees.some(emp => col.condition(emp))
        )}
        row={10}
      />

      <AddEmployeeModal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setIsAddingEmployee(false);
          setIsDepartmentDropdownVisible(false);
          setSelectedDepartment(null);
        }}
        selectedDepartment={selectedDepartment}  
        onAddEmployee={addEmployee}
      />

<AddEvaluationModal
  isOpen={isEvaluationModalOpen}
  onClose={() => setEvaluationModalOpen(false)}
  employeeId={selectedEmployeeId}
  onEvaluationAdded={fetchEmployees}
/>

<ViewEvaluationModal
  isOpen={showEvaluation}
  onClose={() => setShowEvaluation(false)}
  employeeId={selectedEmployeeId}
/>
    </div>
  );
};

export default Employees;
