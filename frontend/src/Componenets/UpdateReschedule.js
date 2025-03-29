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
  const navigate = useNavigate();

  // Validation Functions
  const validateUserId = (userId) => {
    const regex = /^(IT|CS|CSNE|SE|DS)\d{8}$/;
    return regex.test(userId);
  };

  const validateExaminerId = (examinerId) => {
    const regex = /^E\d{4}$/;
    return regex.test(examinerId);
  };

  const validateModuleCode = (moduleCode) => {
    const regex = /^(IT|CS|CSNE|SE|DS)\d{4}$/;
    const numPart = moduleCode.slice(2);
    return regex.test(moduleCode) && !/(\d)\1{3}/.test(numPart);
  };

  const validateDate = (date) => {
    const today = new Date().toISOString().split('T')[0];  
    return date >= today;
  };

  const validateTime = (currentTime, reqTime, currentDate, reqDate) => {
    const currentTimeObj = new Date(`${currentDate}T${currentTime}`);
    const reqTimeObj = new Date(`${reqDate}T${reqTime}`);

    if (currentDate === reqDate) {
      return reqTimeObj > currentTimeObj;
    }
    return true;  
  };

  const validateVenues = (currentVenue, reqVenue) => {
    return currentVenue !== reqVenue;
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8070/reschedule/get/${id}`)
      .then((response) => {
        setReschedule(response.data.fetch);  
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
  const handleSave = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    if (!validateUserId(reschedule.userId)) {
      alert('User ID must start with IT, CS, CSNE, SE, or DS followed by 8 digits.');
      return;
    }

    if (!validateExaminerId(reschedule.examinerId)) {
      alert('Examiner ID must start with E followed by 4 digits.');
      return;
    }

    if (!validateModuleCode(reschedule.module_code)) {
      alert('Module Code must start with IT, CS, CSNE, SE, or DS followed by 4 digits. It should not have consecutive digits.');
      return;
    }

    if (!validateDate(reschedule.current_date) || !validateDate(reschedule.req_date)) {
      alert('Both current and requested dates must be today or in the future.');
      return;
    }

    if (!validateTime(reschedule.current_time, reschedule.req_time, reschedule.current_date, reschedule.req_date)) {
      alert('Requested time must be after current time if the date is today.');
      return;
    }

    if (!validateVenues(reschedule.current_venue, reschedule.req_venue)) {
      alert('Current and Requested venues must be different.');
      return;
    }

    try {
      // Send updated data to backend
      await axios.put(`http://localhost:8070/reschedule/update/${id}`, reschedule);
      alert('Reschedule details updated successfully');
      navigate('/get-reschedule-admin');
    } catch (error) {
      console.error('Error updating reschedule:', error);
      alert('Failed to update reschedule details');
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    navigate('/get-reschedule-admin'); // Navigate to the admin schedules page
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url(/images/work1.jpg)' }}>
      <form
        onSubmit={handleSave}
        className="w-full max-w-md p-6 bg-white bg-opacity-50 shadow-md rounded-lg border border-gray-300"
      >
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">Update Reschedule Details</h2>

        {/* Input fields */}
        <label htmlFor="userId" className="block text-sm font-medium text-gray-700">User ID:</label>
        <input
          type="text"
          id="userId"
          name="userId"
          value={reschedule.userId}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label htmlFor="examinerId" className="block text-sm font-medium text-gray-700">Examiner ID:</label>
        <input
          type="text"
          id="examinerId"
          name="examinerId"
          value={reschedule.examinerId}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label htmlFor="moduleCode" className="block text-sm font-medium text-gray-700">Module Code:</label>
        <input
          type="text"
          id="moduleCode"
          name="module_code"
          value={reschedule.module_code}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label htmlFor="currentDate" className="block text-sm font-medium text-gray-700">Current Date:</label>
        <input
          type="date"
          id="currentDate"
          name="current_date"
          value={reschedule.current_date}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label htmlFor="reqDate" className="block text-sm font-medium text-gray-700">Requested Date:</label>
        <input
          type="date"
          id="reqDate"
          name="req_date"
          value={reschedule.req_date}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label htmlFor="currentTime" className="block text-sm font-medium text-gray-700">Current Time:</label>
        <input
          type="time"
          id="currentTime"
          name="current_time"
          value={reschedule.current_time}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label htmlFor="reqTime" className="block text-sm font-medium text-gray-700">Requested Time:</label>
        <input
          type="time"
          id="reqTime"
          name="req_time"
          value={reschedule.req_time}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label htmlFor="currentVenue" className="block text-sm font-medium text-gray-700">Current Venue:</label>
        <input
          type="text"
          id="currentVenue"
          name="current_venue"
          value={reschedule.current_venue}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label htmlFor="reqVenue" className="block text-sm font-medium text-gray-700">Requested Venue:</label>
        <input
          type="text"
          id="reqVenue"
          name="req_venue"
          value={reschedule.req_venue}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Submit and Cancel buttons */}
        <button
          type="submit"
          className="w-full p-3 mt-4 text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-md"
        >
          Update Reschedule
        </button>

        {/* Cancel button */}
        <button
          type="button"
          onClick={handleCancel}
          className="w-full p-3 mt-4 text-white bg-gray-500 hover:bg-gray-600 rounded-lg shadow-md"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}