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
    const moduleRegex = /^(IT|SE|CS|DS|ISE|CSNE)[1-4]\d{3}$/; 
    const today = new Date().toISOString().split("T")[0];  

    if (!examinerName.trim()) errors.examinerName = "Examiner name is required";
    else if (!nameRegex.test(examinerName)) errors.examinerName = "Only letters and spaces allowed";

    if (!examinerId.trim()) errors.examinerId = "Examiner ID is required";
    else if (!idRegex.test(examinerId)) errors.examinerId = "ID must be like E1234";

    if (!moduleCode.trim()) errors.moduleCode = "Module code is required";
    else if (!moduleRegex.test(moduleCode)) errors.moduleCode = "Invalid format (e.g., IT2010)";

    if (!availability.trim()) errors.availability = "Availability is required";
    else if (!["Available", "Unavailable"].includes(availability)) errors.availability = "Must be 'Available' or 'Unavailable'";

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
    .then(() => {
      alert("New examiner added successfully");
      setName(""); setId(""); setCode(""); setAvailability(""); setDate("");
      navigate("/get-examiner"); 
    })
    .catch(err => {
      alert("Failed to add new examiner: " + (err.response?.data?.message || "Unknown error"));
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-950 to-blue-800">
      <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-lg p-8 bg-white shadow-2xl rounded-2xl border border-gray-200"
      >
        <h2 className="text-center text-3xl font-bold uppercase text-blue-900 mb-8 tracking-wide drop-shadow">Add Examiner</h2>

        {[{
          label: 'Examiner Name', value: examinerName, setValue: setName, name: 'examinerName', type: 'text'
        },{
          label: 'Examiner ID', value: examinerId, setValue: setId, name: 'examinerId', type: 'text'
        },{
          label: 'Module Code', value: moduleCode, setValue: setCode, name: 'moduleCode', type: 'text'
        }].map(({ label, value, setValue, name, type }) => (
          <div key={name} className="mb-5">
            <label className="block text-sm font-medium text-gray-800 mb-1">{label}:</label>
            <input 
              type={type}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors[name] && <p className="text-red-600 text-sm mt-1">{errors[name]}</p>}
          </div>
        ))}

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-800 mb-1">Availability:</label>
          <select 
            value={availability} 
            onChange={(e) => setAvailability(e.target.value)} 
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Availability</option>
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
          {errors.availability && <p className="text-red-600 text-sm mt-1">{errors.availability}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-800 mb-1">Date:</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date}</p>}
        </div>

        <button 
          type="submit" 
          className="w-full p-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-200 shadow"
        >
          Submit
        </button>

        <button 
          type="button" 
          onClick={() => navigate("/get-examiner")} 
          className="w-full mt-4 p-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition duration-200 shadow"
        >
          More Info
        </button>
      </form>
    </div>
  );
}
