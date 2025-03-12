import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Checkbox } from "flowbite-react";
import { FaDownload } from "react-icons/fa";
import { FiTrash } from "react-icons/fi"; // Importing delete icon
import MuiTable from "../mui/TableMuiCustom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Report = () => {
  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeTab, setActiveTab] = useState("detail");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [td, setTd] = useState([]);
  const token = localStorage.getItem("token");
  const organizationId = localStorage.getItem("selectedOrganizationId");

  // Ref to capture the table for PDF download
  const tableRef = useRef(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/user/view-report/${organizationId}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        if (response.data.success) {
          const formattedData = response.data.data.map((item) => ({
            id: item.user_id,
            name: item.full_name,
            department: item.department_name,
            designation: item.designation,
            email: item.email,
            phone: item.phone,
            performance: `${item.performance_score}`,
            date: item.created_on.split("T")[0],
          }));
          setTd(formattedData);
          console.log("Formatted Data:", formattedData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data!", {
          position: 'top-right',
          autoClose: 3000
        });
      }
    };
    fetchData();
  }, []);

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

  const handleDelete = (rowId) => {
    alert(`Delete row with ID ${rowId}`);
    
  };

  const handleStartDateChange = (value) => {
    setStartDate(value ? new Date(value) : null);
  };

  const handleEndDateChange = (value) => {
    setEndDate(value ? new Date(value) : null);
  };

  // Filter the data based on start and end dates
  const filteredData = td.filter((row) => {
    if (!startDate && !endDate) return true;
    const rowDate = row.date;
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // Set time to 0:00:00 to compare only dates
    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);
    
    return (
      (!start || rowDate >= start) && 
      (!end || rowDate <= end)
    );
  });

  // Download the table as a PDF
  const handleDownloadPDF = () => {
    const input = tableRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("report.pdf");
    });
  };

  return (
    <div>
      <ToastContainer />
      <div className="flex flex-col lg:flex-row justify-between items-center m-6 gap-4">
        <div></div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <button
            className="flex items-center px-4 py-2 bg-gray-100 text-black rounded-lg shadow-lg border border-gray-200 hover:bg-gray-100"
            onClick={handleDownloadPDF}
          >
            <FaDownload className="mr-2" />
            Download
          </button>
        </div>
      </div>

      {activeTab === "detail" ? (
        <div ref={tableRef}>
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
              performance: "Performance Score",
              action: "Action",
            }}
            td={filteredData
              .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
              .map((row , index) => ({
                ...row,
                id: (
                  <div className="flex items-center">
                    <Checkbox
                      id={row.id}
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                    />
                    <span className="ml-2">{index + 1}</span>
                  </div>
                ),
                action: (
                  <div className="flex justify-center">
                    <FiTrash
                      className="cursor-pointer text-xl text-red-600"
                      onClick={() => handleDelete(row.id)}
                    />
                  </div>
                ),
              }))}
            styleTableContainer={{ boxShadow: "none", borderRadius: "10px" }}
            styleTableThead={{ backgroundColor: "#F8F9FA" }}
            styleTableTh={{ fontWeight: "bold", color: "#333", fontSize: "16px" }}
            styleTableTbody={{ backgroundColor: "#FFFFFF" }}
            cellStyles={{
              department: { fontWeight: "500", color: "#555", fontSize: "15px", fontFamily: "Poppins, sans-serif" },
              name: { fontSize: "15px", color: "#444", fontFamily: "Poppins, sans-serif" },
              email: { fontSize: "15px", color: "#444", fontFamily: "Poppins, sans-serif" },
              phone: { fontSize: "15px", color: "#444", fontFamily: "Poppins, sans-serif" },
              designation: { fontSize: "15px", color: "#444", fontFamily: "Poppins, sans-serif" },
              performance: { fontSize: "15px", color: "#444", fontFamily: "Poppins, sans-serif" },
              action: { fontSize: "15px", color: "#444", fontFamily: "Poppins, sans-serif" },
            }}
            rowStyles={{ backgroundColor: "#Ffffff", fontSize: "24px", color: "#333" }}
          />
        </div>
      ) : (
        <GraphReport startDate={startDate} endDate={endDate} />
      )}
    </div>
  );
};

export default Report;
