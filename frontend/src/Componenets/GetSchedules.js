import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DisplayReschedule() {
  const [reschedules, setReschedules] = useState([]);
  const [editingReschedule, setEditingReschedule] = useState(null);  
  const [updatedDetails, setUpdatedDetails] = useState({
    userId: "",
    examinerId: "",
    module_code: "",
    current_date: "",
    req_date: "",
    current_time: "",
    req_time: "",
    current_venue: "",
    req_venue: "",
  });

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

  const handleUpdate = (id) => {
    const rescheduleToEdit = reschedules.find((reschedule) => reschedule._id === id);
    setEditingReschedule(rescheduleToEdit);
    setUpdatedDetails({
      userId: rescheduleToEdit.userId,
      examinerId: rescheduleToEdit.examinerId,
      module_code: rescheduleToEdit.module_code,
      current_date: rescheduleToEdit.current_date,
      req_date: rescheduleToEdit.req_date,
      current_time: rescheduleToEdit.current_time,
      req_time: rescheduleToEdit.req_time,
      current_venue: rescheduleToEdit.current_venue,
      req_venue: rescheduleToEdit.req_venue,
    });
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveUpdate = async () => {
    try {
      await axios.put(`http://localhost:8070/reschedule/update/${editingReschedule._id}`, updatedDetails);
       
      setReschedules(
        reschedules.map((reschedule) =>
          reschedule._id === editingReschedule._id ? { ...reschedule, ...updatedDetails } : reschedule
        )
      );
      setEditingReschedule(null);  
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  const handleCancelUpdate = () => {
    setEditingReschedule(null);  
  };

  const handleAddSchedule = () => {
    navigate("/add-reschedule");  
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-50">
      <div className="w-full h-full overflow-auto p-0 bg-white shadow-md border border-gray-300">
        <h2 className="text-center text-2xl font-semibold text-gray-800 py-4">Reschedule Details</h2>

        <div className="text-right p-4">
          <button
            onClick={handleAddSchedule}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Schedule
          </button>
        </div>

        <div className="overflow-x-auto h-full">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">User ID</th>
                <th className="border border-gray-300 p-2">Examiner ID</th>
                <th className="border border-gray-300 p-2">Module Code</th>
                <th className="border border-gray-300 p-2">Current Date</th>
                <th className="border border-gray-300 p-2">Requested Date</th>
                <th className="border border-gray-300 p-2">Current Time</th>
                <th className="border border-gray-300 p-2">Requested Time</th>
                <th className="border border-gray-300 p-2">Current Venue</th>
                <th className="border border-gray-300 p-2">Requested Venue</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reschedules.map((reschedule) => (
                <tr key={reschedule._id} className="text-center border-b border-gray-300">
                  <td className="border border-gray-300 p-2">{reschedule.userId}</td>
                  <td className="border border-gray-300 p-2">{reschedule.examinerId}</td>
                  <td className="border border-gray-300 p-2">{reschedule.module_code}</td>
                  <td className="border border-gray-300 p-2">{reschedule.current_date}</td>
                  <td className="border border-gray-300 p-2">{reschedule.req_date}</td>
                  <td className="border border-gray-300 p-2">{reschedule.current_time}</td>
                  <td className="border border-gray-300 p-2">{reschedule.req_time}</td>
                  <td className="border border-gray-300 p-2">{reschedule.current_venue}</td>
                  <td className="border border-gray-300 p-2">{reschedule.req_venue}</td>
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
                </tr>
              ))}
            </tbody>
          </table>

          {/* Update Form */}
          {editingReschedule && (
            <div className="mt-4 p-4 border border-gray-300">
              <h3 className="text-lg font-semibold">Update Reschedule</h3>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700">User ID</label>
                  <input
                    type="text"
                    name="userId"
                    value={updatedDetails.userId}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Examiner ID</label>
                  <input
                    type="text"
                    name="examinerId"
                    value={updatedDetails.examinerId}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Module Code</label>
                  <input
                    type="text"
                    name="module_code"
                    value={updatedDetails.module_code}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Current Date</label>
                  <input
                    type="text"
                    name="current_date"
                    value={updatedDetails.current_date}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Requested Date</label>
                  <input
                    type="text"
                    name="req_date"
                    value={updatedDetails.req_date}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Current Time</label>
                  <input
                    type="text"
                    name="current_time"
                    value={updatedDetails.current_time}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Requested Time</label>
                  <input
                    type="text"
                    name="req_time"
                    value={updatedDetails.req_time}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Current Venue</label>
                  <input
                    type="text"
                    name="current_venue"
                    value={updatedDetails.current_venue}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Requested Venue</label>
                  <input
                    type="text"
                    name="req_venue"
                    value={updatedDetails.req_venue}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 w-full"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleSaveUpdate}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelUpdate}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}






