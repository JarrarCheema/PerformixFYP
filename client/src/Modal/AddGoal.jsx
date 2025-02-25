import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";

export default function GoalModal({ isOpen, onClose, newGoal, setNewGoal, addTask }) {
  const [milestones, setMilestones] = useState([""]);

  if (!isOpen) return null;

  const addMilestone = () => {
    setMilestones([...milestones, ""]);
  };

  const updateMilestone = (index, value) => {
    const updatedMilestones = [...milestones];
    updatedMilestones[index] = value;
    setMilestones(updatedMilestones);
  };

  const deleteMilestone = (index) => {
    const updatedMilestones = milestones.filter((_, i) => i !== index);
    setMilestones(updatedMilestones);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add New Goal</h3>
          <button onClick={onClose} className="text-gray-500 text-lg">✖</button>
        </div>

        <div className="space-y-4">
          <div className="flex space-x-2">
            <div className="w-1/2">
              <label className="block text-sm font-bold text-black">Task Name</label>
              <input
                type="text"
                placeholder="Enter Task Name"
                className="w-full border p-2 rounded-lg"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-bold text-black">Completion Date</label>
              <input
                type="date"
                className="w-full border p-2 rounded-lg"
                value={newGoal.date}
                onChange={(e) => setNewGoal({ ...newGoal, date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-black">Description</label>
            <textarea
              placeholder="Add Description"
              className="w-full border p-2 rounded-lg"
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
            ></textarea>
          </div>

          <div className="">
            <label className="block text-sm font-bold text-black">Milestones</label>
            {milestones.map((milestone, index) => (
              <div key={index} className="relative mt-2">
                <input
                  type="text"
                  className="w-full border p-2 rounded-lg pr-10"
                  value={milestone}
                  onChange={(e) => updateMilestone(index, e.target.value)}
                  placeholder={`Milestone #${index + 1}`}
                />
                <button
                  onClick={() => deleteMilestone(index)}
                  className="absolute right-3 top-2/3 transform -translate-y-1/2 text-red-500 hover:text-red-700"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            ))}
            <button
              onClick={addMilestone}
              className="bg-gray-200 px-3 py-2 rounded-lg mt-2 text-gray-700 hover:bg-gray-300"
            >
              +
            </button>
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-2">Attachment</label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" />
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded-lg">Cancel</button>
          <button onClick={addTask} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Save Goal</button>
        </div>
      </div>
    </div>
  );
}
