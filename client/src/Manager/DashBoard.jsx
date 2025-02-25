
import React, { useState } from "react";
import { Card, Dropdown } from "flowbite-react";  // Import Dropdown from flowbite-react
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import CustomTable from "../Flowbite/CustomTable"; // Correct import path
import PaginatedTable from "../Flowbite/PaginatedTable";

const cardData = [
  { title: "Total Departments", value: "06" },
  { title: "Total Employees", value: 210 },
  { title: "Total Team", value: 78 },
  {title:"to be Evaluated",value:56},

];

const chartData = [
  { name: "Sales", performanceB: 60, performanceA: 70 },
  { name: "Marketing", performanceA: 90, performanceB: 80 },
  { name: "Finance", performanceB: 50, performanceA: 60 },
  { name: "Tech Support", performanceA: 70, performanceB: 65 },
  { name: "Operations", performanceB: 75, performanceA: 85 },
  { name: "Customer Service", performanceA: 55, performanceB: 65 },
];

const employees = [
  { name: "Aaqib", email: "aaqib@domain.com", phone: "+123 456 7890", designation: "Product Designer" },
  { name: "Osman", email: "osman@domain.com", phone: "+123 456 7890", designation: "UX Analyst" },
  { name: "Noriaz", email: "noriaz@domain.com", phone: "+123 456 7890", designation: "UX Strategist" },
  { name: "Aiza", email: "aiza@domain.com", phone: "+123 456 7890", designation: "Product Designer", actions: "..." },
  { name: "Nashra", email: "nashra@domain.com", phone: "+123 456 7890", designation: "UX Analyst", actions: "..." },
  { name: "Sana", email: "sana@domain.com", phone: "+123 456 7890", designation: "UX Strategist", actions: "..." },
  { name: "Aqsa", email: "aqsa@domain.com", phone: "+123 456 7890", designation: "Product Manager", actions: "..." },
];

const columns = [
  { header: "Employee Name", key: "name" },
  { header: "Email Address", key: "email" },
  { header: "Phone Number", key: "phone" },
  { header: "Designation", key: "designation" },
];

const activities = [
  { title: "General Text", description: "John Doe added as an Employee in Sales" },
  { title: "General Text", description: "John Doe updated profile information" },
  { title: "General Text", description: "Jane Smith completed a project milestone" },
  { title: "General Text", description: "David Brown assigned a new task" },
];

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("Last Month"); // Default filter is "Last Month"
  const rowsPerPage = 3;

  const onPageChange = (page) => setCurrentPage(page);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    // Update chartData here as needed based on filter selection
    console.log(`Filter selected: ${filter}`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cardData.map((card, index) => (
          <Card key={index} className="shadow bg-white">
            <div className="flex flex-col">
              <p className="text-xl font-bold text-[#325679] dark:text-white">
                {card.title}
              </p>
              <p className="text-3xl font-bold text-gray-700 dark:text-gray-400">
                {card.value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white shadow p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Graphical Performance</h2>

          {/* Flowbite Dropdown for Filter */}
          <Dropdown
            label={selectedFilter}
            inline={true}
            arrowIcon={true}
            className="cursor-pointer"
          >
            <Dropdown.Item onClick={() => handleFilterChange("Last Month")}>
              Last Month
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilterChange("This Month")}>
              This Month
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilterChange("Last Week")}>
              Last Week
            </Dropdown.Item>
          </Dropdown>
        </div>

        {/* Scrollable chart on small screens */}
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Bar dataKey="performanceA" fill="#0160c9" barSize={25} radius={[5, 5, 0, 0]} />
                <Bar dataKey="performanceB" fill="#7ea8f8" barSize={25} radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col lg:flex-row gap-4 my-2">
        <div className="bg-white shadow p-6 rounded-lg lg:w-2/3">
          <h2 className="text-xl font-bold mb-4">Top Employees</h2>
          <div className="container mx-auto px-4 py-6">
            <PaginatedTable data={employees} columns={columns} row={5} />
          </div>
        </div>

        <div className="bg-white shadow-lg p-6 rounded-lg lg:w-1/3">
<div className="flex justify-between items-center mb-4">
  <h2 className="text-xl font-bold">Recent Activity</h2>
  <p className="text-gray-500 text-lg cursor-pointer">View all</p>
</div>
<ul className="relative">
  {activities.map((activity, index) => (
    <li key={index} className="flex items-start space-x-4 py-4 relative">
      <div className="flex flex-col bg-gray-100 p-4 rounded-lg w-full shadow-sm">
        <div className="flex justify-between items-center">
          <p className="text-sm font-bold">{activity.title}</p>
          <p className="text-sm text-gray-500">{activity.time}</p>
        </div>
        <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
      </div>
      {index !== activities.length - 1 && (
        <div className="absolute left-4 top-22 h-full w-0.5 bg-blue-500"></div>
      )}
    </li>
  ))}
</ul>
</div>
      </div>
    </div>
  );
}


