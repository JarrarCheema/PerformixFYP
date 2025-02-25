import React, { useState } from "react";
import { HiSearch, HiX, HiOutlineDownload } from "react-icons/hi"; // Importing search, close, and download icons
import PaginatedTable from "../Flowbite/PaginatedTable";
import { IoFilterSharp } from "react-icons/io5";
import jsPDF from "jspdf";
import "jspdf-autotable";

const StaffFeedback = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");

  // Sample employee data
  const employees = [
    { user: "ZAPTA Technologies", email: "info@zaptatech.com", department: "Sales", userRole: "Admin", designation: "Manager", phone: "+123 456 798" },
    { user: "10 Pearls", email: "contact@10pearls.com", department: "Marketing", userRole: "Developer", designation: "Software Engineer", phone: "+987 654 321" },
    { user: "MTBC", email: "support@mtbc.com", department: "IT", userRole: "HR", designation: "HR Manager", phone: "+111 222 333" },
    { user: "Netsol Technologies", email: "info@netsoltech.com", department: "Finance", userRole: "Lead", designation: "Project Lead", phone: "+444 555 666" },
    { user: "Systems Limited", email: "info@systemsltd.com", department: "Operations", userRole: "Designer", designation: "UI/UX Designer", phone: "+777 888 999" },
  ];

  const columns = [
    { header: "User", accessor: "user", key: "user" },
    { header: "Email", accessor: "email", key: "email" },
    { header: "Department", accessor: "department", key: "department" },
    { header: "User Role", accessor: "userRole", key: "userRole" },
    { header: "Designation", accessor: "designation", key: "designation" },
    { header: "Phone", accessor: "phone", key: "phone" },
    { header: "Action", accessor: "action", isAction: true, key: "action" },
  ];

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Employee Data", 14, 10); // Add a title to the PDF

    // Generate the table for the PDF
    doc.autoTable({
      head: [["User", "Email", "Department", "User Role", "Designation", "Phone"]],
      body: employees.map((emp) => [
        emp.user,
        emp.email,
        emp.department,
        emp.userRole,
        emp.designation,
        emp.phone,
      ]),
      startY: 20, // Start position for the table
    });

    // Save the generated PDF
    doc.save("EmployeeData.pdf");
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setEditModalOpen(true);
  };

  const handleDetail = (employee) => {
    navigate("/admin/stafffeedback/:id", { state: { employee } });
  };

  const handleDelete = async (employee) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${employee.user}"?`);

    if (confirmDelete) {
      console.log("Deleted employee:", employee);
      // Add delete logic here
    }
  };

  const handleFilterDepartment = (event) => {
    setFilterDepartment(event.target.value);
  };

  // Filter employees by department and search term
  const filteredData = employees.filter(
    (emp) =>
      emp.user.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterDepartment === "" || emp.department === filterDepartment)
  );

  return (
    <div className="bg-white shadow rounded-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-col sm:flex-row">
        <h2 className="hidden md:block text-lg font-semibold text-gray-700">Staff Feedback</h2>

        {/* Right Side: Search, Filter, and Export Button */}
        <div className="flex flex-col sm:flex-row items-center space-x-2 sm:space-x-2 mt-4 sm:mt-0">
          {/* Search Input Field */}
          <div className="relative w-full sm:w-90 mb-2 sm:mb-0">
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

          {/* Filter Dropdown */}
          {/* <div className="relative">
  <IoFilterSharp className="absolute left-3 top-2.5 text-gray-500" size={20} />
  <select
    value={filterDepartment}
    onChange={handleFilterDepartment}
    className="w-full pl-10 border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
  >
    <option value="">All Departments</option>
    <option value="Sales">Sales</option>
    <option value="Marketing">Marketing</option>
    <option value="IT">IT</option>
    <option value="Finance">Finance</option>
    <option value="Operations">Operations</option>
  </select>
</div> */}


          {/* Export Button */}
          <button
            className="bg-blue-500 w-2/3 text-white px-4 py-2 rounded-lg flex items-center space-x-1"
            onClick={handleExportPDF}
          >
            <HiOutlineDownload className="text-white" size={20} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Paginated Table Component */}
      <PaginatedTable
        data={filteredData}
        columns={columns}
        row={10}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDetail={handleDetail}
      />

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4 text-gray-500 text-sm">
        <span className="font-bold text-md text-gray-800">
          Showing <span className="text-blue-900">1-10</span> of <span className="text-blue-900">1000</span>
        </span>
      </div>
    </div>
  );
};

export default StaffFeedback;
