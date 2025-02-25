import React from "react";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
);

const GraphReport = () => {
  // Doughnut Chart Data
  const chartData = {
    labels: ["Productivity", "Quality of Work", "Team Work", "Time Management"],
    datasets: [
      {
        data: [30, 77, 32, 67],
        backgroundColor: ["#A9D1FF", "#0057FF", "#C4DFF6", "#4A9EFF"],
        hoverBackgroundColor: ["#8ABAE3", "#0047D4", "#B0CCE8", "#3A8ADC"],
        borderWidth: 0,
      },
    ],
  };

  // Doughnut Chart Options
  const chartOptions = {
    cutout: "70%",
    plugins: {
      legend: { display: false },
    },
  };

  // Line Chart Data
  const lineChartData = {
    labels: ["Productivity", "Quality of Work", "Team Work", "Time Management"],
    datasets: [
      {
        label: "Team A",
        data: [25, 90, 50, 80],
        borderColor: "#4A9EFF",
        backgroundColor: "rgba(74, 158, 255, 0.2)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Team B",
        data: [15, 60, 40, 70],
        borderColor: "#0077B6",
        backgroundColor: "rgba(0, 119, 182, 0.2)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Line Chart Options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: "rgba(0, 0, 0, 0.1)" },
      },
    },
  };

  // ✅ Define `filteredData` for Bar Chart
  const filteredData = [
    { name: "Productivity",  performanceB: 25 },
    { name: "Quality of Work", performanceA: 77, },
    { name: "Team Work",  performanceB: 50 },
    { name: "Time Management", performanceA: 67 },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
        {/* Doughnut Chart Card */}
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-[#484A54]">Department</h2>
          <div className="flex flex-col lg:flex-row justify-between items-center mt-5">
            <div className="mt-4">
              <ul>
                <li className="flex items-center mb-6">
                  <span className="w-3 h-3 bg-[#A9D1FF] rounded-full inline-block mr-6"></span>
                  Productivity <span className="ml-8"><strong>30%</strong></span>
                </li>
                <li className="flex items-center mb-6">
                  <span className="w-3 h-3 bg-[#0057FF] rounded-full inline-block mr-6"></span>
                  Quality of Work <span className="ml-8"><strong>77%</strong></span>
                </li>
                <li className="flex items-center mb-6">
                  <span className="w-3 h-3 bg-[#C4DFF6] rounded-full inline-block mr-6"></span>
                  Team Work <span className="ml-8"><strong>32%</strong></span>
                </li>
                <li className="flex items-center mb-6">
                  <span className="w-3 h-3 bg-[#4A9EFF] rounded-full inline-block mr-6"></span>
                  Time Management <span className="ml-8"><strong>67%</strong></span>
                </li>
              </ul>
            </div>
            <div className="w-64 h-64">
              <Doughnut data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Line Chart Section */}
        <div className="bg-white shadow-lg p-6 rounded-lg overflow-x-auto ">
          <h2 className="text-xl font-bold mb-4 text-[#484A54]">Department</h2>
          <div className="min-w-[500px] h-[400px]">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>
      </div>

      {/* Bar Chart Section */}
      <div className="overflow-x-auto mt-8 shadow-lg">
        <div className="min-w-[900px]">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={filteredData} // ✅ No more undefined error!
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Bar
                dataKey="performanceA"
                fill="#0160c9"
                barSize={25}
                radius={[5, 5, 0, 0]}
              />
              <Bar
                dataKey="performanceB"
                fill="#7ea8f8"
                barSize={25}
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GraphReport;
