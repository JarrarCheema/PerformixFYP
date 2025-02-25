import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const donutData = [
  { name: "Productivity", value: 30 },
  { name: "Quality of Work", value: 77 },
  { name: "Team Work", value: 32 },
  { name: "Time Management", value: 67 },
];

const areaData = [
  { date: "Jan 21", value1: 5000, value2: 2000 },
  { date: "Jan 22", value1: 7000, value2: 4000 },
  { date: "Jan 23", value1: 15000, value2: 8000 },
  { date: "Jan 24", value1: 11000, value2: 6000 },
  { date: "Jan 25", value1: 12000, value2: 9000 },
  { date: "Jan 26", value1: 15000, value2: 14000 },
  { date: "Jan 27", value1: 20000, value2: 16000 },
];

const DONUT_COLORS = ["#006de4", "#3393fc", "#b0d5fe"];

// Custom Tooltip for Pie Chart
const DonutTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const total = donutData.reduce((acc, item) => acc + item.value, 0);
    const percentage = ((payload[0].value / total) * 100).toFixed(2);

    return (
      <div className="bg-white shadow rounded p-2 text-sm">
        <p>{`${payload[0].name}: ${percentage}%`}</p>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Area Chart
const AreaTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow rounded p-2 text-sm">
        {payload.map((data, index) => (
          <p key={index} style={{ color: data.color }}>
            {`${data.name}: ${data.value.toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function GraphReport() {
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Donut Chart */}
        <div className="bg-white rounded-2xl shadow p-6 overflow-x-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Department</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                paddingAngle={5}
              >
                {donutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<DonutTooltip />} />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Area Chart */}
        <div className="bg-white rounded-2xl shadow p-6 overflow-x-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Department</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={areaData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c3eef1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#c3eef1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#86c5ed" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#86c5ed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "#6B7280" }}
                tickLine={false}
                axisLine={{ stroke: "#E5E7EB" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#6B7280" }}
                tickLine={false}
                axisLine={{ stroke: "#E5E7EB" }}
              />
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <Tooltip content={<AreaTooltip />} />
              <Area
                type="monotone"
                dataKey="value1"
                stroke="#c3eef1"
                fillOpacity={1}
                fill="url(#colorValue1)"
              />
              <Area
                type="monotone"
                dataKey="value2"
                stroke="#86c5ed"
                fillOpacity={1}
                fill="url(#colorValue2)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
