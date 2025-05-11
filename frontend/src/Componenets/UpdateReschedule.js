import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2';

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
      Swal.fire({
        icon: 'error',
        title: 'Invalid User ID',
        text: 'User ID must start with IT, CS, CSNE, SE, or DS followed by 8 digits.',
        background: '#1e293b',
        color: '#e2e8f0',
        confirmButtonColor: '#4f46e5'
      });
      return;
    }

    if (!validateExaminerId(reschedule.examinerId)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Examiner ID',
        text: 'Examiner ID must start with E followed by 4 digits.',
        background: '#1e293b',
        color: '#e2e8f0',
        confirmButtonColor: '#4f46e5'
      });
      return;
    }

    if (!validateModuleCode(reschedule.module_code)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Module Code',
        text: 'Module Code must start with IT, CS, CSNE, SE, or DS followed by 4 digits. It should not have consecutive digits.',
        background: '#1e293b',
        color: '#e2e8f0',
        confirmButtonColor: '#4f46e5'
      });
      return;
    }

    if (!validateDate(reschedule.current_date) || !validateDate(reschedule.req_date)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Date',
        text: 'Both current and requested dates must be today or in the future.',
        background: '#1e293b',
        color: '#e2e8f0',
        confirmButtonColor: '#4f46e5'
      });
      return;
    }

    if (!validateTime(reschedule.current_time, reschedule.req_time, reschedule.current_date, reschedule.req_date)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Time',
        text: 'Requested time must be after current time if the date is today.',
        background: '#1e293b',
        color: '#e2e8f0',
        confirmButtonColor: '#4f46e5'
      });
      return;
    }

    if (!validateVenues(reschedule.current_venue, reschedule.req_venue)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Venues',
        text: 'Current and Requested venues must be different.',
        background: '#1e293b',
        color: '#e2e8f0',
        confirmButtonColor: '#4f46e5'
      });
      return;
    }

    try {
      // Send updated data to backend
      await axios.put(`http://localhost:8070/reschedule/update/${id}`, reschedule);
      Swal.fire({
        icon: 'success',
        title: 'Reschedule Updated Successfully!',
        text: 'The reschedule request has been updated.',
        background: '#1e293b',
        color: '#e2e8f0',
        confirmButtonColor: '#4f46e5',
        timer: 2000
      });
      navigate('/get-reschedule-admin');
    } catch (error) {
      console.error('Error updating reschedule:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Update',
        text: 'Failed to update reschedule details.',
        background: '#1e293b',
        color: '#e2e8f0',
        confirmButtonColor: '#4f46e5'
      });
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

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-6 rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-red-500 text-white py-2 px-6 rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
