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

  const handleSubmit = (e) => {
    e.preventDefault();
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

        navigate('/get-reschedule');
        
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
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 bg-white shadow-md rounded-lg border border-gray-300"
      >
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">Add Rechedule Details</h2>

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
          onClick={() => navigate('/get-reschedule')}  
          className="w-full p-3 mt-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          All Reschedules
        </button>
      </form>
    </div>
  );
}



