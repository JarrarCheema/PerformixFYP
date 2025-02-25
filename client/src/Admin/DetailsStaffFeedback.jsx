import React from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai';

const DetailsStaffFeedback = () => {
    return (
        <div className="m-6 p-6 bg-white shadow-lg rounded-lg">
            <button className="flex items-center text-gray-500 hover:text-gray-700 mb-4">
                <AiOutlineArrowLeft className="w-5 h-5 mr-2" />
                Back
            </button>
            <h1 className="text-xl font-semibold text-gray-900 mb-4">Improvement in Team Collaboration Tools</h1>
            
            <h2 className="text-lg font-medium text-gray-700 mb-2">Feedback Message</h2>
            <p className="text-gray-600 leading-relaxed">
                “I appreciate how the organization promotes a healthy work environment and consistently sets clear 
                performance goals through Performix. However, I believe there could be more opportunities for professional growth. 
                While we have regular check-ins on our performance metrics, offering more workshops, mentorship programs, 
                and career development opportunities could help employees feel more engaged and motivated to improve their skills.
                The organization promotes a healthy work environment and consistently sets clear performance goals through Performix. 
                However, I believe there could be more opportunities for professional growth. While we have regular check-ins on our performance metrics, 
                offering more workshops, mentorship programs, and career development opportunities could help employees feel more engaged and motivated 
                to improve their skills.”
            </p>
            
            <div className="mt-6 border-t pt-4">
                <p className="text-gray-700"><span className="font-bold text-gray-900">Employee Name:</span> Sarah Johnson</p>
                <p className="text-gray-700"><span className="font-bold text-gray-900">Department:</span> Web Designing</p>
                <p className="text-gray-700"><span className="font-bold text-gray-900">Date:</span> September 18, 2024</p>
            </div>
        </div>
    );
};

export default DetailsStaffFeedback;
