import React, { useEffect, useState } from "react";
import axios from "axios";

function Recomendation() {
  const [recommendations, setRecommendations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of recommendations per page

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token from local storage
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get(
        "http://localhost:8080/recommendation/get-recommendations",
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      const data = response.data.recommendations || []; // Ensure data is an array
      setRecommendations(data);
      console.log("Response:", data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = recommendations.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Recommendations</h2>

      {currentItems.length > 0 ? (
        
        currentItems.map((rec) => (
          <div key={rec.recommendation_id} className="border p-4 mb-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">{rec.recommendation_text}</h3>
            <p className="text-gray-600">
              Employee: {rec.employee_name} ({rec.employee_email})
            </p>
            <p className="text-gray-600">
              Admin: {rec.admin_name} ({rec.admin_email})
            </p>
            <p className="text-sm text-gray-500">
              Created On: {new Date(rec.created_on).toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <div className="text-center mt-6">
          <p className="text-lg text-gray-500">No recommendations available at the moment.</p>
          <p className="text-gray-400">Check back later for updates.</p>
        </div>
      )}

      {/* Show Pagination Only If There Are Recommendations */}
      {recommendations.length > itemsPerPage  && recommendations > 0 ?  (
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <button
            onClick={() =>
              setCurrentPage((prev) =>
                prev * itemsPerPage < recommendations.length ? prev + 1 : prev
              )
            }
            disabled={currentPage * itemsPerPage >= recommendations.length}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      ) :''
    
    
    }
    </div>
  );
}

export default Recomendation;
