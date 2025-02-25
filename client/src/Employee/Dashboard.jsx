import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const activities = [
    { title: "General Text", description: "John Doe added as an Employee in Sales", time: "1 hr ago" },
    { title: "General Text", description: "John Doe updated profile information", time: "2 hrs ago" },
    { title: "General Text", description: "Jane Smith completed a project milestone", time: "4 hrs ago" },
    { title: "General Text", description: "David Brown assigned a new task", time: "5 hrs ago" },
  ];
  const [recommendation, setRecommendation] = useState("");

  const handleSubmit = () => {
    alert(`Recommendation Submitted: ${recommendation}`);
    setRecommendation("");
  };

  const chartData = {
    labels: ["Productivity", "Quality of Work", "Team Work", "Time Management"],
    datasets: [
      {
        data: [30, 77, 32, 67], // Percentage values
        backgroundColor: ["#A9D1FF", "#0057FF", "#C4DFF6", "#4A9EFF"],
        hoverBackgroundColor: ["#8ABAE3", "#0047D4", "#B0CCE8", "#3A8ADC"],
        borderWidth: 0,
      },
    ],
  };
  const feedbackList = [
    { text: "You are doing great just work on your time management", type: "positive" },
    { text: "You are doing well", type: "positive" },
    { text: "Need to improve typography", type: "negative" },
    { text: "You are doing great just work on your time management", type: "positive" },
    { text: "Need to improve and work on style guide", type: "negative" },
    { text: "Need to work more on visual hierarchy", type: "negative" },
    { text: "You are doing great just work on your time management", type: "positive" },
  ];


  const chartOptions = {
    cutout: "70%", // Creates the inner space for the ring effect
    plugins: {
      legend: {
        display: false, // Hide the default legend
      },
    },
  };

  return (
    <div className="container mx-auto p-4">
      {/* Rank & Survey Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="p-2 bg-white rounded-lg border-l-4 border-[#335679]">
          <h2 className="text-2xl font-semibold mb-4 text-[#335679] ms-2">My Rank</h2>
          <h2 className="text-2xl font-semibold mb-4 text-[#000000] ms-2">7th</h2>
        </div>
        <div className="p-2 bg-white rounded-lg border-l-4 border-[#1FB356]">
          <h2 className="text-2xl font-semibold mb-4 text-[#335679] ms-2">Survey</h2>
          <h2 className="text-2xl font-semibold mb-4 text-[#1FB356] ms-2">Available</h2>
        </div>
      </div>

      {/* Recent Activity & Doughnut Chart Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
        {/* Doughnut Chart Card */}
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Last Month Performance</h2>
         <div className="flex flex-col lg:flex-row justify-between items-center mt-5">

         <div className="mt-4">
            <ul>
              <li className="flex items-center mb-6">
                <span className="w-3 h-3 bg-[#A9D1FF] rounded-full inline-block mr-6"></span> Productivity - 30%
              </li>
              <li className="flex items-center mb-6">
                <span className="w-3 h-3 bg-[#0057FF] rounded-full inline-block mr-6"></span> Quality of Work - 77%
              </li>
              <li className="flex items-center mb-6">
                <span className="w-3 h-3 bg-[#C4DFF6] rounded-full inline-block mr-6"></span> Team Work - 32%
              </li>
              <li className="flex items-center mb-6">
                <span className="w-3 h-3 bg-[#4A9EFF] rounded-full inline-block mr-6"></span> Time Management - 67%
              </li>
            </ul>
          </div>
         <div className="w-64 h-64">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
          {/* Legend */}
       
         </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white shadow-lg p-6 rounded-lg w-full">
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
                  <div className="absolute left-4 top-22 h-8 w-0.5 bg-blue-500"></div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Monthly Feedback */}
        <div className="p-6 bg-white shadow-lg rounded-lg border">
          <h2 className="text-lg font-bold mb-4">Monthly Feedback</h2>
          <ul>
            {feedbackList.map((feedback, index) => (
              <li key={index} className={`text-lg mb-2 ${feedback.type === "positive" ? "text-green-600" : "text-red-600"}`}>
                • {feedback.text}
              </li>
            ))}
          </ul>
        </div>

        {/* Submit Recommendation */}
        <div className="p-6 bg-white shadow-lg rounded-lg border">
  <h2 className="text-lg font-bold mb-4">Submit Recommendation</h2>
  <textarea
    className="w-full p-4 border rounded-md text-sm focus:outline-none focus:ring focus:ring-blue-200"
    rows="4"
    placeholder="Write your recommendation here.."
    value={recommendation}
    onChange={(e) => setRecommendation(e.target.value)}
  ></textarea>

  {/* Button aligned at the end */}
  <div className="flex justify-end mt-3">
    <button
      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
      onClick={handleSubmit}
    >
      Submit
    </button>
  </div>
</div>

      </div>
    </div>
  );
};

export default Dashboard;
