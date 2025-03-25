import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function AddExaminer() {
  const [examinerName, setName] = useState("");
  const [examinerId, setId] = useState(""); 
  const [moduleCode, setCode] = useState("");
  const [availability, setAvailability] = useState("");
  const [date, setDate] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validateForm = () => {
    let errors = {};
    const nameRegex = /^[A-Za-z ]+$/;  
    const idRegex = /^E\d{4}$/; 
    const moduleRegex = /^(IT|SE|CS|DS|ISE|CSNE)[1-4][0-9]{3}$/; 
    const today = new Date().toISOString().split("T")[0];  

    // Validate examiner name
    if (!examinerName.trim()) errors.examinerName = "Examiner name is required";
    else if (!nameRegex.test(examinerName)) errors.examinerName = "Only letters and spaces allowed";

    // Validate examiner ID
    if (!examinerId.trim()) errors.examinerId = "Examiner ID is required";
    else if (!idRegex.test(examinerId)) errors.examinerId = "Alphanumeric only (no special characters)";

    // Validate module code
    if (!moduleCode.trim()) errors.moduleCode = "Module code is required";
    else if (!moduleRegex.test(moduleCode)) errors.moduleCode = "Module code format is invalid. It should be like IT2010, CS4050, SE2030.";

    // Validate availability
    if (!availability.trim()) errors.availability = "Availability is required";
    else if (!["Available", "Unavailable"].includes(availability)) errors.availability = "Must be 'Available' or 'Unavailable'";

    // Validate date
    if (!date) errors.date = "Date is required";
    else if (date < today) errors.date = "Date cannot be in the past";

    setErrors(errors);  
    return Object.keys(errors).length === 0; 
};


  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
  
    const newExaminer = { examinerName, examinerId, moduleCode, availability, date };
  
    axios.post("http://localhost:8070/examiner/create", newExaminer, {
      headers: { "Content-Type": "application/json" },
    })
    .then(response => {
      alert("New examiner added successfully");
      setName(""); setId(""); setCode(""); setAvailability(""); setDate("");
      navigate("/get-examiner"); 
    })
    .catch(err => {
      alert("Failed to add new examiner: " + (err.response?.data?.message || "Unknown error"));
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg border border-gray-300"
      >
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">Add Examiner</h2>

        <label className="block text-sm font-medium text-gray-700">Examiner Name:</label>
        <input 
          type="text" 
          value={examinerName} 
          onChange={(e) => setName(e.target.value)} 
          className="input-field"
        />
        {errors.examinerName && <p className="text-red-500 text-sm">{errors.examinerName}</p>}

        <label className="block text-sm font-medium text-gray-700 mt-4">Examiner ID:</label>
        <input 
          type="text" 
          value={examinerId} 
          onChange={(e) => setId(e.target.value)} 
          className="input-field"
        />
        {errors.examinerId && <p className="text-red-500 text-sm">{errors.examinerId}</p>}

        <label className="block text-sm font-medium text-gray-700 mt-4">Module Code:</label>
        <input 
          type="text" 
          value={moduleCode} 
          onChange={(e) => setCode(e.target.value)} 
          className="input-field"
        />
        {errors.moduleCode && <p className="text-red-500 text-sm">{errors.moduleCode}</p>}

        <label className="block text-sm font-medium text-gray-700 mt-4">Availability:</label>
        <select 
          value={availability} 
          onChange={(e) => setAvailability(e.target.value)} 
          className="input-field"
        >
          <option value="">Select Availability</option>
          <option value="Available">Available</option>
          <option value="Unavailable">Unavailable</option>
        </select>
        {errors.availability && <p className="text-red-500 text-sm">{errors.availability}</p>}

        <label className="block text-sm font-medium text-gray-700 mt-4">Date:</label>
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          className="input-field"
        />
        {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}

        <button 
          type="submit" 
          className="w-full mt-6 p-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
        >
          Submit
        </button>

        {/* More Info Button */}
        <button 
          type="button" 
          onClick={() => navigate("/get-examiner")} 
          className="w-full mt-3 p-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600"
        >
          More Info
        </button>
      </form>
    </div>
  );
}


 







