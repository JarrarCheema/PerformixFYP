import React, { useState } from "react";
import { Checkbox, Dropdown } from "flowbite-react";
import { FaDownload } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import MuiTable from "../mui/TableMuiCustom";
import { Datepicker } from "flowbite-react";
import GraphReport from "./GraphReport";
import { saveAs } from "file-saver"; // Import FileSaver
import jsPDF from "jspdf"; // Import jsPDF

const Report = () => {
  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeTab, setActiveTab] = useState("detail");

  // New state for start and end dates
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const td = [
    {
      id: "001",
      name: "Nicklaus Mikaelson",
      department: "Design",
      designation: "Tech Support",
      email: "abcxyz@gmail.com",
      phone: "+123 456 7890",
      performance: "25%",
      date: "2025-02-01",
    },
    {
      id: "002",
      name: "Freightliner",
      department: "IT",
      designation: "Software Developer",
      email: "abcxyz@gmail.com",
      phone: "+123 456 7890",
      performance: "25%",
      date: "2025-02-05",
    },
    {
      id: "003",
      name: "Mercedes Sprinter",
      department: "Business Analyst",
      designation: "IT Coordinator",
      email: "abcxyz@gmail.com",
      phone: "+123 456 7890",
      performance: "25%",
      date: "2025-01-28",
    },
    {
      id: "004",
      name: "Ford Transit",
      department: "Development",
      designation: "System Analyst",
      email: "abcxyz@gmail.com",
      phone: "+123 456 7890",
      performance: "25%",
      date: "2025-02-02",
    },
    {
      id: "005",
      name: "Nicklaus Mikaelson",
      department: "Design",
      designation: "Data Analyst",
      email: "abcxyz@gmail.com",
      phone: "+123 456 7890",
      performance: "25%",
      date: "2025-02-03",
    },
    {
      id: "006",
      name: "Transit",
      department: "Development",
      designation: "Cloud Engineer",
      email: "abcxyz@gmail.com",
      phone: "+123 456 7890",
      performance: "25%",
      date: "2025-02-04",
    },
  ];

  const totalPages = Math.ceil(td.length / rowsPerPage);

  const handleSelectAll = () => {
    if (selectedRows.length === td.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(td.map((row) => row.id));
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };

  const handleMenuAction = (action, rowId) => {
    if (action === "detail") {
      alert(`View details of ${rowId}`);
    } else if (action === "delete") {
      alert(`Delete row with ID ${rowId}`);
    }
  };

  // Function to download table data as PDF
  const downloadTableData = () => {
    const doc = new jsPDF();
    
    const headers = ["ID", "Name", "Department", "Designation", "Email", "Phone", "Performance"];
    const rows = td.map((row) => [
      row.id,
      row.name,
      row.department,
      row.designation,
      row.email,
      row.phone,
      row.performance,
    ]);

    doc.setFontSize(12);
    doc.text("Detail Report", 20, 20); // Title at the top
    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 30, // Where to start drawing the table
      theme: "grid",
    });

    doc.save("table_report.pdf"); // Save as PDF
  };

  // Function to download graph as an image
  const downloadGraphReport = () => {
    const svg = document.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    saveAs(blob, "graph_report.svg");
  };

  // Filter the data based on start and end dates
  const filteredData = td.filter((row) => {
    if (!startDate && !endDate) return true; // Show all if no date filter is applied
    const rowDate = new Date(row.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    return (
      (!start || rowDate >= start) && (!end || rowDate <= end)
    );
  });

  return (
    <div>
      <div className="flex flex-col lg:flex-row justify-between items-center m-6 gap-4">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row gap-4">
          <p className="text-gray-900 font-semibold flex items-center">
            Start Date:{" "}
            <Datepicker value={startDate} onChange={setStartDate} />
          </p>
          <p className="text-gray-900 font-semibold flex items-center">
            End Date: <Datepicker value={endDate} onChange={setEndDate} />
          </p>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <button
            className="flex items-center px-4 py-2 bg-gray-100 text-black rounded-lg shadow-lg border border-gray-200 hover:bg-gray-100"
            onClick={activeTab === "detail" ? downloadTableData : downloadGraphReport}
          >
            <FaDownload className="mr-2" />
            Download
          </button>
          <div className="p-2 bg-gray-200 rounded-lg flex gap-2">
            <button
              className={`px-4 py-2 ${activeTab === "graph" ? "bg-gray-300" : "bg-gray-200"} text-gray-700 rounded-lg shadow hover:bg-gray-300`}
              onClick={() => setActiveTab("graph")}
            >
              Graph Report
            </button>
            <button
              className={`px-4 py-2 ${activeTab === "detail" ? "bg-gray-300" : "bg-gray-200"} text-gray-700 rounded-lg shadow hover:bg-gray-300`}
              onClick={() => setActiveTab("detail")}
            >
              Detail Report
            </button>
          </div>
        </div>
      </div>

      {activeTab === "detail" ? (
        <MuiTable
          th={{
            id: (
              <div className="flex items-center">
                <Checkbox
                  id="selectAll"
                  onChange={handleSelectAll}
                  checked={selectedRows.length === filteredData.length}
                />
                <span className="ml-2">ID</span>
              </div>
            ),
            department: "Department",
            name: "Name",
            email: "Email",
            phone: "Phone",
            designation: "Designation",
            performance: "Performance Matrix",
            action: "Action",
          }}
          td={filteredData
            .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
            .map((row) => ({
              ...row,
              id: (
                <div className="flex items-center">
                  <Checkbox
                    id={row.id}
                    checked={selectedRows.includes(row.id)}
                    onChange={() => handleSelectRow(row.id)}
                  />
                  <span className="ml-2">{row.id}</span>
                </div>
              ),
              action: (
                <Dropdown
                  arrowIcon={false}
                  inline={true}
                  label={<FiMoreVertical className="cursor-pointer text-xl" />}
                >
                  <Dropdown.Item onClick={() => handleMenuAction("detail", row.id)}>
                    Detail
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleMenuAction("delete", row.id)}>
                    Delete
                  </Dropdown.Item>
                </Dropdown>
              ),
            }))}
          styleTableContainer={{ boxShadow: "none", borderRadius: "10px" }}
          styleTableThead={{ backgroundColor: "#F8F9FA" }}
          styleTableTh={{ fontWeight: "bold", color: "#333", fontSize: "16px" }}
          styleTableTbody={{ backgroundColor: "#FFFFFF" }}
          cellStyles={{
            department: { fontWeight: "500", color: "#555", fontSize: "18px" },
            employees: { fontSize: "19px", color: "#444" },
            performance: { fontSize: "18px", color: "#444" },
            id: { fontSize: "18px", color: "#444" },
          }}
          rowStyles={{
            backgroundColor: "#FFFFFF",
            fontSize: "24px",
            color: "#333",
          }}
          headerRounded={true}
          rowRounded={true}
        />
      ) : (
        <GraphReport startDate={startDate} endDate={endDate} />

      )}

      {/* Pagination Section */}
      {activeTab === "detail" && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-gray-900 font-semibold">
            Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
            {Math.min(currentPage * rowsPerPage, filteredData.length)} of{" "}
            {filteredData.length}
          </p>
          <nav aria-label="Page navigation example">
            <ul className="inline-flex -space-x-px text-sm">
              <li>
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="px-3 h-8 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100"
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i}>
                  <button
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 h-8 border border-gray-300 hover:bg-gray-100 ${
                      currentPage === i + 1
                        ? "bg-blue-700 text-white"
                        : "bg-white text-gray-500"
                    }`}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="px-3 h-8 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100"
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Report;
