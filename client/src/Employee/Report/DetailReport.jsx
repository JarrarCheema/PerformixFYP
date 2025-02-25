import React from "react";
import "flowbite/dist/flowbite.css";
import { Label, TextInput } from "flowbite-react";
import img from '../../assets/Image wrap.png';  

const DetailReport = () => {
  return (
    <div className="flex-col m-4">
      {/* Profile Section */}
      

      {/* Personal Info Section */}
      <div className="flex mt-16 justify-between">
        <div className="m-3 w-1/3">
          <h3 className="text-xl font-semibold">Personal Info</h3>
          <p className="text-sm text-gray-500">Update your photo and personal details.</p>
        </div>
        <div className="w-2/3 bg-white rounded-lg p-5 shadow-lg">
        <div className="flex w-full items-center justify-start m-3">
  <div className="flex flex-col items-center text-center">
    <img
      src={img}
      alt="Profile"
      className="w-16 h-16 rounded-full border-4 border-white shadow-md"
    />
    <h4 className="text-md font-semibold text-gray-800 mt-2">Aaqib Aizaz</h4>
  </div>
</div>

          <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            
            <div>
              <Label htmlFor="department" value="Department" />
              <TextInput id="department" type="text" value="Design" readOnly />
            </div>
            <div>
              <Label htmlFor="position" value="Position" />
              <TextInput id="position" type="text" value="UI/UX Designer" readOnly />
            </div>
            <div>
              <Label htmlFor="email" value="Email Address" />
              <TextInput id="email" type="email" value="sandra@design.com" readOnly />
            </div>
            <div>
              <Label htmlFor="employee-id" value="Employee ID" />
              <TextInput id="employee-id" type="text" value="#47372" readOnly />
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Parameters Section */}
      <div className="flex w-full mt-16 justify-between">
        <div className="m-3 w-1/3">
          <h3 className="text-lg font-semibold">Evaluation Parameters</h3>
          <p className="text-sm text-gray-500">Please enter parameters to evaluate employee</p>
        </div>
        <div className="mb-6 w-2/3">
          <div className="w-full bg-white p-6 rounded-lg shadow-lg grid grid-cols-1 gap-4 mt-4">
            {["Quality", "Productivity", "Time Management", "Teamwork"].map((param) => (
              <div key={param} className="flex flex-col space-y-2">
                <Label htmlFor={param.toLowerCase()} value={param} />
                <div className="flex space-x-4">
                  <TextInput className="w-full" id={param.toLowerCase()} type="number" placeholder="Enter %" />
                  <TextInput className="w-full" placeholder="Remarks" />
                </div>
                <span className="text-xs text-gray-500">Weightage: 25%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="flex w-full mt-16 justify-between">
        <div className="m-3 w-1/3">
          <h3 className="text-lg font-semibold">Feedback</h3>
          <p className="text-sm text-gray-500">Please provide your feedback for evaluation</p>
        </div>
        <div className="w-2/3 bg-white rounded-lg p-5 shadow-lg">
          <h3 className="text-lg font-semibold">Areas for Improvement</h3>
          <p className="text-sm text-gray-500">Work on time management to meet tight deadlines.</p>
          <h3 className="text-lg font-semibold mt-8">Overall</h3>
          <p className="text-sm text-gray-500">You have great potential and are on track for success. Focus on these areas to maximize your project impact.</p>
        </div>
      </div>
    </div>
  );
};

export default DetailReport;
