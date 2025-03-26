import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateReschedule() {
  const [reschedule, setReschedule] = useState({
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

  const { id } = useParams();
  console.log(id);  
  const navigate = useNavigate();

  // Fetch data when the component mounts
  useEffect(() => {
    axios
      .get(`http://localhost:8070/reschedule/get/${id}`)
      .then((response) => {
        console.log(response.data.fetch); // Ensure data is being logged
        setReschedule(response.data.fetch); // Update state with fetched data
      })
      .catch((error) => {
        console.error("Error fetching reschedule data:", error);
      });
  }, [id]);
  

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReschedule((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle save (submit) the updated data
  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:8070/reschedule/update/${id}`, reschedule);
      navigate("/get-reschedule"); // Redirect to the get-reschedule page
    } catch (error) {
      console.error("Error updating reschedule data:", error);
    }
  };

  // Handle cancel, just navigate back to the get-reschedule page
  const handleCancel = () => {
    navigate("/get-reschedule");
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-50">
      <div className="w-full h-full overflow-auto p-4 bg-white shadow-md border border-gray-300">
        <h2 className="text-center text-2xl font-semibold text-gray-800 py-4">Update Reschedule</h2>
        <div className="w-full max-w-md mx-auto">
          <form>
            <div className="mb-4">
              <label htmlFor="userId" className="block text-gray-700">User ID</label>
              <input
                type="text"
                id="userId"
                name="userId"
                value={reschedule.userId}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="examinerId" className="block text-gray-700">Examiner ID</label>
              <input
                type="text"
                id="examinerId"
                name="examinerId"
                value={reschedule.examinerId}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="module_code" className="block text-gray-700">Module Code</label>
              <input
                type="text"
                id="module_code"
                name="module_code"
                value={reschedule.module_code}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="current_date" className="block text-gray-700">Current Date</label>
              <input
                type="text"
                id="current_date"
                name="current_date"
                value={reschedule.current_date}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="req_date" className="block text-gray-700">Requested Date</label>
              <input
                type="text"
                id="req_date"
                name="req_date"
                value={reschedule.req_date}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="current_time" className="block text-gray-700">Current Time</label>
              <input
                type="text"
                id="current_time"
                name="current_time"
                value={reschedule.current_time}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="req_time" className="block text-gray-700">Requested Time</label>
              <input
                type="text"
                id="req_time"
                name="req_time"
                value={reschedule.req_time}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="current_venue" className="block text-gray-700">Current Venue</label>
              <input
                type="text"
                id="current_venue"
                name="current_venue"
                value={reschedule.current_venue}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="req_venue" className="block text-gray-700">Requested Venue</label>
              <input
                type="text"
                id="req_venue"
                name="req_venue"
                value={reschedule.req_venue}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}