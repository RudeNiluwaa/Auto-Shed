import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function GetSchedules({ role }) {
  const [reschedules, setReschedules] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8070/reschedule")
      .then((response) => {
        setReschedules(response.data);
      })
      .catch((error) => {
        console.error("Error fetching reschedule details:", error);
      });
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      try {
        await axios.delete(`http://localhost:8070/reschedule/delete/${id}`);
        setReschedules(reschedules.filter((reschedule) => reschedule._id !== id));
      } catch (error) {
        console.error("Error deleting request:", error);
      }
    }
  };

  const handleUpdate = (id) => {
    navigate(`/update-reschedule/${id}`);
  };

  const handleAddSchedule = () => {
    navigate("/add-reschedule");
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-cover bg-center bg-fixed p-0 m-0" 
     style={{ backgroundImage: 'url(/images/work2.jpg)' }}>
      <div className="w-full max-w-full overflow-auto bg-white/80 shadow-md border border-gray-300 mt-4 p-4">
        <h2 className="text-center text-2xl font-semibold text-gray-800 py-4">Reschedule Details</h2>

      <div className="text-right mb-4">
              {role === "user" && (
                <button
                  onClick={handleAddSchedule}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add Schedule
                </button>
        )}
      </div>


        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 bg-white shadow-md">
            <thead className="bg-gray-300 text-gray-800">
              <tr>
                <th className="border border-gray-400 p-2">User ID</th>
                <th className="border border-gray-400 p-2">Examiner ID</th>
                <th className="border border-gray-400 p-2">Module Code</th>
                <th className="border border-gray-400 p-2">Current Date</th>
                <th className="border border-gray-400 p-2">Requested Date</th>
                <th className="border border-gray-400 p-2">Current Time</th>
                <th className="border border-gray-400 p-2">Requested Time</th>
                <th className="border border-gray-400 p-2">Current Venue</th>
                <th className="border border-gray-400 p-2">Requested Venue</th>
                {role === "admin" && <th className="border border-gray-400 p-2">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {reschedules.map((reschedule) => (
                <tr key={reschedule._id} className="text-center border-b border-gray-300 bg-white">
                  <td className="border border-gray-300 p-2">{reschedule.userId}</td>
                  <td className="border border-gray-300 p-2">{reschedule.examinerId}</td>
                  <td className="border border-gray-300 p-2">{reschedule.module_code}</td>
                  <td className="border border-gray-300 p-2">{reschedule.current_date}</td>
                  <td className="border border-gray-300 p-2">{reschedule.req_date}</td>
                  <td className="border border-gray-300 p-2">{reschedule.current_time}</td>
                  <td className="border border-gray-300 p-2">{reschedule.req_time}</td>
                  <td className="border border-gray-300 p-2">{reschedule.current_venue}</td>
                  <td className="border border-gray-300 p-2">{reschedule.req_venue}</td>
                  {role === "admin" && (
                    <td className="border border-gray-300 p-2 flex justify-center gap-2">
                      <button
                        onClick={() => handleUpdate(reschedule._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(reschedule._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}






