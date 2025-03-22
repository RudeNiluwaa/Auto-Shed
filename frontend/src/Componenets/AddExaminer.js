import React, { useState } from 'react';
import axios from 'axios';

export default function AddExaminer() {
  const [examinerName, setName] = useState("");
  const [examinerId, setId] = useState("");
  const [moduleCode, setCode] = useState("");
  const [availability, setAvailability] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const newExaminer = { examinerName, examinerId, moduleCode, availability, date };
  
    axios.post("http://localhost:8070/examiner/create", newExaminer, {
      headers: {
        "Content-Type": "application/json",  
      },
    })
    .then(response => {
      console.log("Success:", response.data);  // Log the response from the backend
      alert("New examiner added successfully");
    })
    .catch(err => {
      if (err.response) {
        // If there's a response error (like 400, 500, etc.), show the response message
        if (err.response.data.message.includes("E11000 duplicate key error")) {
          alert("Examiner ID already exists. Please choose a different ID.");
        } else {
          console.error("Error:", err.response.data);
          alert(`Failed to add new examiner: ${err.response.data.message || "Unknown error"}`);
        }
      } else if (err.request) {
        // If no response received, but the request was sent
        console.error("Error:", err.request);
        alert("Failed to add new examiner: No response from server");
      } else {
        // For any other errors (e.g., setup errors)
        console.error("Error:", err.message);
        alert(`Failed to add new examiner: ${err.message}`);
      }
    });
  };
  
  

  const formStyle = {
    width: "350px",
    margin: "auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)"
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    margin: "5px 0",
    borderRadius: "5px",
    border: "1px solid #aaa"
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px"
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={formStyle} onSubmit={handleSubmit}>
        <h2 style={{ textAlign: "center", color: "#333" }}>Add Examiner</h2>

        <label htmlFor="examinerName">Examiner Name:</label>
        <input
          type="text"
          id="examinerName"
          name="examinerName"
          value={examinerName}
          onChange={(e) => setName(e.target.value)}
          required
          style={inputStyle}
        />

        <label htmlFor="examinerId">Examiner ID:</label>
        <input
          type="text"
          id="examinerId"
          name="examinerId"
          value={examinerId}
          onChange={(e) => setId(e.target.value)}
          required
          style={inputStyle}
        />

        <label htmlFor="moduleCode">Module Code:</label>
        <input
          type="text"
          id="moduleCode"
          name="moduleCode"
          value={moduleCode}
          onChange={(e) => setCode(e.target.value)}
          required
          style={inputStyle}
        />

        <label htmlFor="availability">Availability:</label>
        <input
          type="text"
          id="availability"
          name="availability"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          required
          style={inputStyle}
        />

        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          name="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>Submit</button>
      </form>
    </div>
  );
}


