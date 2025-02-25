import React from "react";
import "flowbite/dist/flowbite.css";
import { Label, TextInput, Button } from "flowbite-react";
import img from '../assets/Image wrap.png';  

const Evaluation = () => {
  return (
    <div className="flex-col m-4">
      <div className="flex w-full items-center space-x-4 m-3 justify-between">
        <div className="flex items-center space-x-4"> 
          <img
            src={img}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white shadow-md"
          />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Aaqib Aizaz</h2>
            <p className="text-gray-500">olivia@untitledui.com</p>
          </div>
        </div>
        <div className="me-4">
          <button 
            type="button" 
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-md px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </div>
      </div>

      <div className="flex mt-16 justify-between">
        <div className="m-3">
          <h3 className="text-xl font-semibold">Personal Info</h3>
          <p className="text-sm text-gray-500">Update your photo and personal details.</p>
        </div>
        <div className="w-2/3 bg-white rounded-lg p-5">
          <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700 mb-8">
            <div 
              className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" 
              style={{ width: "45%" }}
            >
              45%
            </div>
          </div>
          <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="department" value="Department" />
              <TextInput id="department" type="text" sizing="md" value="Design" readOnly />
            </div>
            <div>
              <Label htmlFor="position" value="Position" />
              <TextInput id="position" type="text" sizing="md" value="UI/UX Designer" readOnly />
            </div>
            <div>
              <Label htmlFor="email" value="Email Address" />
              <TextInput id="email" type="email" sizing="md" value="sandra@design.com" readOnly />
            </div>
            <div>
              <Label htmlFor="employee-id" value="Employee ID" />
              <TextInput id="employee-id" type="text" sizing="md" value="#47372" readOnly />
            </div>
          </div>
        </div>
      </div>
<div className="flex w-full mt-16 justify-between">
<div className="m-3 w-1/3">
<h3 className="text-lg font-semibold  ">Evaluation Parameters</h3>
        <p className="text-sm text-gray-500">Please enter parameters to evaluate employee</p>
  
</div>
<div className="mb-6 w-2/3">
            <div className="w-full bg-white p-6 rounded-lg shadow-md grid grid-cols-1  gap-4 mt-4">
          {["Quality", "Productivity", "Time Management", "Teamwork"].map((param) => (
            <div key={param} className="flex flex-col space-y-2">
              <Label htmlFor={param.toLowerCase()} value={param} />
              <div className="flex space-x-4">
                <TextInput className="w-full" id={param.toLowerCase()} type="number" placeholder="Enter %" />
                <TextInput className="w-full"  placeholder="Remarks" />
              </div>
              <span className="text-xs text-gray-500">Weightage: 25%</span>
            </div>
          ))}
        </div>
      </div>
</div>
<div className="flex w-full mt-16 justify-between">
  <div className="m-3 w-1/3">
  <h3 className="text-lg font-semibold  ">FeedBack</h3>
        <p className="text-sm text-gray-500">Please provide your feedBack for evaluation</p>

  </div>
  <div className="w-2/3 bg-white rounded-lg p-5">
  <h3 className="text-lg font-semibold  ">Areas for Inprovement </h3>
        <p className="text-sm text-gray-500">Work on  the time management to meet tight deadline</p>

        <h3 className="text-lg font-semibold mt-8  ">Overall</h3>
        <p className="text-sm text-gray-500">You have greate potential and are on track for success Focus on these areas to maximize your Project</p>

  </div>
</div>
      
    </div>
  );
};

export default Evaluation;
