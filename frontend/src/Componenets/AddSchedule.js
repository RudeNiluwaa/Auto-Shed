import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddRechedule() {
  const [userId, setUserId] = useState('');
  const [examinerId, setExaminerId] = useState('');
  const [module_code, setModuleCode] = useState('');
  const [current_date, setCurrentDate] = useState('');
  const [req_date, setReqDate] = useState('');
  const [current_time, setCurrentTime] = useState('');
  const [req_time, setReqTime] = useState('');
  const [current_venue, setCurrentVenue] = useState('');
  const [req_venue, setReqVenue] = useState('');

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
    const today = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
    return date >= today;
  };

  const validateTime = (currentTime, reqTime, currentDate, reqDate) => {
    const currentTimeObj = new Date(`${currentDate}T${currentTime}`);
    const reqTimeObj = new Date(`${reqDate}T${reqTime}`);

    if (currentDate === reqDate) {
      return reqTimeObj > currentTimeObj;
    }
    return true; // If the requested date is after the current date, no need for time comparison
  };

  const validateVenues = (currentVenue, reqVenue) => {
    return currentVenue !== reqVenue;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    if (!validateUserId(userId)) {
      alert('User ID must start with IT, CS, CSNE, SE, or DS followed by 8 digits.');
      return;
    }

    if (!validateExaminerId(examinerId)) {
      alert('Examiner ID must start with E followed by 4 digits.');
      return;
    }

    if (!validateModuleCode(module_code)) {
      alert('Module Code must start with IT, CS, CSNE, SE, or DS followed by 4 digits. It should not have consecutive digits.');
      return;
    }

    if (!validateDate(current_date) || !validateDate(req_date)) {
      alert('Both current and requested dates must be today or in the future.');
      return;
    }

    if (!validateTime(current_time, req_time, current_date, req_date)) {
      alert('Requested time must be after current time if the date is today.');
      return;
    }

    if (!validateVenues(current_venue, req_venue)) {
      alert('Current and Requested venues must be different.');
      return;
    }

    const newRechedule = {
      userId,
      examinerId,
      module_code,
      current_date,
      req_date,
      current_time,
      req_time,
      current_venue,
      req_venue
    };

    // Send data to backend
    axios
      .post('http://localhost:8070/reschedule/add', newRechedule)
      .then((response) => {
        console.log('Success:', response.data);
        alert('Rechedule details added successfully');
        navigate('/get-reschedule-user');

        // Reset form
        setUserId('');
        setExaminerId('');
        setModuleCode('');
        setCurrentDate('');
        setReqDate('');
        setCurrentTime('');
        setReqTime('');
        setCurrentVenue('');
        setReqVenue('');
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Failed to add rechedule details');
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-cover bg-center" 
    style={{ backgroundImage: 'url(/images/work1.jpg)' }}>
     <form
  onSubmit={handleSubmit}
  className="w-full max-w-md p-6 bg-white bg-opacity-50 shadow-md rounded-lg border border-gray-300"
>
  <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">Add Reschedule Details</h2>

  {/* Input fields */}
  <label htmlFor="userId" className="block text-sm font-medium text-gray-700">User ID:</label>
  <input
    type="text"
    id="userId"
    name="userId"
    value={userId}
    onChange={(e) => setUserId(e.target.value)}
    required
    className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <label htmlFor="examinerId" className="block text-sm font-medium text-gray-700">Examiner ID:</label>
  <input
    type="text"
    id="examinerId"
    name="examinerId"
    value={examinerId}
    onChange={(e) => setExaminerId(e.target.value)}
    required
    className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <label htmlFor="moduleCode" className="block text-sm font-medium text-gray-700">Module Code:</label>
  <input
    type="text"
    id="moduleCode"
    name="moduleCode"
    value={module_code}
    onChange={(e) => setModuleCode(e.target.value)}
    required
    className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <label htmlFor="currentDate" className="block text-sm font-medium text-gray-700">Current Date:</label>
  <input
    type="date"
    id="currentDate"
    name="currentDate"
    value={current_date}
    onChange={(e) => setCurrentDate(e.target.value)}
    required
    className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <label htmlFor="reqDate" className="block text-sm font-medium text-gray-700">Requested Date:</label>
  <input
    type="date"
    id="reqDate"
    name="reqDate"
    value={req_date}
    onChange={(e) => setReqDate(e.target.value)}
    required
    className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <label htmlFor="currentTime" className="block text-sm font-medium text-gray-700">Current Time:</label>
  <input
    type="time"
    id="currentTime"
    name="currentTime"
    value={current_time}
    onChange={(e) => setCurrentTime(e.target.value)}
    required
    className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <label htmlFor="reqTime" className="block text-sm font-medium text-gray-700">Requested Time:</label>
  <input
    type="time"
    id="reqTime"
    name="reqTime"
    value={req_time}
    onChange={(e) => setReqTime(e.target.value)}
    required
    className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <label htmlFor="currentVenue" className="block text-sm font-medium text-gray-700">Current Venue:</label>
  <input
    type="text"
    id="currentVenue"
    name="currentVenue"
    value={current_venue}
    onChange={(e) => setCurrentVenue(e.target.value)}
    required
    className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <label htmlFor="reqVenue" className="block text-sm font-medium text-gray-700">Requested Venue:</label>
  <input
    type="text"
    id="reqVenue"
    name="reqVenue"
    value={req_venue}
    onChange={(e) => setReqVenue(e.target.value)}
    required
    className="w-full p-3 mb-6 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <button
    type="submit"
    className="w-full p-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
  >
    Submit
  </button>

  <button
    type="button"
    onClick={() => navigate('/get-reschedule-user')}
    className="w-full p-3 mt-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    All Reschedules
  </button>
</form>

    </div>
  );
}



