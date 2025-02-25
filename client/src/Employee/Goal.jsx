import { useState } from "react";
import { HiSearch, HiX, HiOutlineDownload } from "react-icons/hi";
import { FaPlus } from "react-icons/fa6";
import { MdFilterList } from "react-icons/md";
import GoalModal from "../Modal/AddGoal"; // Import modal

export default function Goal() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Landing Page Design",
      date: "6 Sep, 2024",
      subtasks: ["Hero Section Design", "About Us Section Design", "Pricing Plans Section Design"],
    },
  ]);
  const [inProgressTasks, setInProgressTasks] = useState([]); // New State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    date: "",
    description: "",
    milestone: "Milestone #01",
    file: null,
  });

  const addTask = (status) => {
    if (!newGoal.title || !newGoal.date) {
      alert("Please fill in all required fields!");
      return;
    }
    const newTask = {
      id: tasks.length + inProgressTasks.length + 1,
      title: newGoal.title,
      date: newGoal.date,
      subtasks: [newGoal.description || "No description provided"],
    };

    if (status === "todo") {
      setTasks([...tasks, newTask]);
    } else if (status === "inProgress") {
      setInProgressTasks([...inProgressTasks, newTask]);
    }

    setIsModalOpen(false);
    setNewGoal({ title: "", date: "", description: "", milestone: "Milestone #01", file: null });
  };

  return (
    <div className="m-2 bg-white rounded-lg px-4 py-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4 flex-col sm:flex-row">
        <h2 className="hidden md:block text-lg font-semibold text-gray-700">Goals</h2>

        <div className="flex flex-col sm:flex-row items-center space-x-2 sm:space-x-2 mt-4 sm:mt-0">
          {/* Search Bar */}
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

          {/* Filter Button */}
          <div className="p-1 border border-gray-300 rounded-lg m-1">
            <MdFilterList size={28} color="#777b8b" />
          </div>

          {/* Add Goal Button */}
          <button
            className="bg-blue-500 w-2/3 text-white px-4 py-2 rounded-lg flex items-center space-x-1"
            onClick={() => setIsModalOpen(true)}
          >
            <HiOutlineDownload className="text-white" size={20} />
            <span>ADD GOAL</span>
          </button>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* To-Do Section */}
        <div className="bg-gray-300 p-3 rounded-lg">
          <div className="flex justify-between items-center m-2">
            <p className="font-semibold">
              To Do <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm">{tasks.length}</span>
            </p>
            <button onClick={() => setIsModalOpen(true)} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
              <FaPlus size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Task List */}
          <div className="mt-2 space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between">
                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                  <span className="text-gray-500 text-sm">{task.date}</span>
                </div>
                <ul className="mt-2 text-gray-700 text-sm">
                  {task.subtasks.map((subtask, index) => (
                    <li key={index} className="list-disc ml-5">{subtask}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* In Progress Section */}
        <div className="bg-gray-400 p-3 rounded-lg">
          <div className="flex justify-between items-center m-2">
            <p className="font-semibold">
              In Progress <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm">{inProgressTasks.length}</span>
            </p>
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <FaPlus size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Task List */}
          <div className="mt-2 space-y-3">
            {inProgressTasks.map((task) => (
              <div key={task.id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between">
                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                  <span className="text-gray-500 text-sm">{task.date}</span>
                </div>
                <ul className="mt-2 text-gray-700 text-sm">
                  {task.subtasks.map((subtask, index) => (
                    <li key={index} className="list-disc ml-5">{subtask}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Placeholder for "Completed" Section */}
        <div className="bg-gray-400 p-3 rounded-lg">
        <div className="flex justify-between items-center m-2">
            <p className="font-semibold">
              Compeleted <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm">{inProgressTasks.length}</span>
            </p>
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <FaPlus size={20} className="text-gray-500" />
            </button>
          </div>

          
        </div>
      </div>

      {/* Modal Component */}
      <GoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        newGoal={newGoal}
        setNewGoal={setNewGoal}
        addTask={() => addTask("todo")}
      />
    </div>
  );
}
