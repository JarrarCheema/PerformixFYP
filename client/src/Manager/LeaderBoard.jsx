import React, { useState } from "react";
import PaginatedTable from "../Flowbite/PaginatedTable";


function LeaderBoard() {
  const [activeTab, setActiveTab] = useState("All departments");

  const tabs = ["All departments", "Engineering", "Sales", "Marketing", "Design"];

  const columns = [
    { header: "Name", key: "name" },
    { header: "Designation", key: "designation" },
    { header: "Performance Score", key: "score" }
  ];

  const data = [
    { name: "Sophia Martinez", designation: "Software Engineer", score: "98%", department: "Engineering" },
    { name: "Liam Thompson", designation: "Sales Executive", score: "91%", department: "Sales" },
    { name: "Olivia Carter", designation: "Marketing Strategist", score: "87%", department: "Marketing" },
    { name: "Noah Robinson", designation: "Business Analyst", score: "85%", department: "Engineering" },
    { name: "Ava Lewis", designation: "UI/UX Designer", score: "80%", department: "Design" },
    { name: "William Johnson", designation: "Customer Support Lead", score: "74%", department: "Sales" },
    { name: "James Anderson", designation: "DevOps Engineer", score: "95%", department: "Engineering" },
    { name: "Emily Scott", designation: "Account Manager", score: "90%", department: "Sales" },
    { name: "Daniel Wilson", designation: "Content Marketer", score: "88%", department: "Marketing" },
    { name: "Charlotte White", designation: "Data Scientist", score: "93%", department: "Engineering" },
    { name: "Benjamin Hall", designation: "Graphic Designer", score: "79%", department: "Design" },
    { name: "Mia Harris", designation: "Customer Success Manager", score: "76%", department: "Sales" },
    { name: "Alexander King", designation: "Full Stack Developer", score: "96%", department: "Engineering" },
    { name: "Amelia Young", designation: "Sales Coordinator", score: "89%", department: "Sales" },
    { name: "Lucas Adams", designation: "SEO Specialist", score: "84%", department: "Marketing" },
    { name: "Harper Nelson", designation: "Cybersecurity Analyst", score: "97%", department: "Engineering" },
    { name: "Ethan Baker", designation: "Visual Designer", score: "81%", department: "Design" },
    { name: "Ella Turner", designation: "Tech Support Specialist", score: "73%", department: "Sales" },
    { name: "Michael Carter", designation: "Cloud Engineer", score: "94%", department: "Engineering" },
    { name: "Abigail Wright", designation: "Sales Representative", score: "92%", department: "Sales" },
    { name: "Henry Torres", designation: "Social Media Manager", score: "86%", department: "Marketing" },
    { name: "Isabella Green", designation: "Machine Learning Engineer", score: "99%", department: "Engineering" },
    { name: "Samuel Lopez", designation: "Product Designer", score: "78%", department: "Design" },
    { name: "Grace Hill", designation: "Customer Relations Manager", score: "75%", department: "Sales" }
  ];
  

  const filteredData = activeTab === "All departments" ? data : data.filter(item => item.department === activeTab);

  return (
    <div className="m-4 h-full bg-gray-200 shadow-lg rounded-lg p-4">
      <h3 className="text-xl font-semibold mb-4">Performance Leaderboard</h3>
      
      <div className="border-b border-gray-300 mb-6 mt-8 overflow-x-auto whitespace-nowrap">
  <div className="flex space-x-6 text-sm">
    {tabs.map(tab => (
      <button
        key={tab}
        className={`pb-2 ${activeTab === tab ? "border-b-2 border-blue-600 text-blue-600 font-semibold" : "text-gray-500 hover:text-gray-600"}`}
        onClick={() => setActiveTab(tab)}
      >
        {tab}
      </button>
    ))}
  </div>
</div>

      
      <PaginatedTable data={filteredData} columns={columns} row={10} />
    </div>
  );
}

export default LeaderBoard;
