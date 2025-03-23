import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function AddExaminer() {
  const [examinerName, setName] = useState("");
  const [examinerId, setId] = useState(""); 
  const [moduleCode, setCode] = useState("");
  const [availability, setAvailability] = useState("");
  const [date, setDate] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const newExaminer = { examinerName, examinerId, moduleCode, availability, date };
  
    axios.post("http://localhost:8070/examiner/create", newExaminer, {
      headers: {
        "Content-Type": "application/json",  
      },
    })
    .then(response => {
      console.log("Success:", response.data);
      alert("New examiner added successfully");

       setName("");
       setId("");
       setCode("");
       setAvailability("");
       setDate("");
       
       navigate("/get"); 
    })
    .catch(err => {
      if (err.response) {
        if (err.response.data.message.includes("E11000 duplicate key error")) {
          alert("Examiner ID already exists. Please choose a different ID.");
        } else {
          console.error("Error:", err.response.data);
          alert(`Failed to add new examiner: ${err.response.data.message || "Unknown error"}`);
        }
      } else if (err.request) {
        console.error("Error:", err.request);
        alert("Failed to add new examiner: No response from server");
      } else {
        console.error("Error:", err.message);
        alert(`Failed to add new examiner: ${err.message}`);
      }
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-white shadow-md rounded-lg border border-gray-300">
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">Add Examiner</h2>

        <label htmlFor="examinerName" className="block text-sm font-medium text-gray-700">Examiner Name:</label>
        <input
          type="text"
          id="examinerName"
          name="examinerName"
          value={examinerName}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label htmlFor="examinerId" className="block text-sm font-medium text-gray-700">Examiner ID:</label>
        <input
          type="text"
          id="examinerId"
          name="examinerId"
          value={examinerId}
          onChange={(e) => setId(e.target.value)}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label htmlFor="moduleCode" className="block text-sm font-medium text-gray-700">Module Code:</label>
        <input
          type="text"
          id="moduleCode"
          name="moduleCode"
          value={moduleCode}
          onChange={(e) => setCode(e.target.value)}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label htmlFor="availability" className="block text-sm font-medium text-gray-700">Availability:</label>
        <input
          type="text"
          id="availability"
          name="availability"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date:</label>
        <input
          type="date"
          id="date"
          name="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button type="submit" className="w-full p-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
          Submit
        </button>
      </form>
    </div>
  );
}



