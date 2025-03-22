import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ExaminerList() {
  const [examiners, setExaminers] = useState([]);

  // Fetch examiners data from the backend
  useEffect(() => {
    axios.get('http://localhost:8070/examiner/')
      .then(response => {
        setExaminers(response.data); // Assuming the response is an array of examiners
      })
      .catch(error => {
        console.error("There was an error fetching the examiners data:", error);
      });
  }, []); // The empty array ensures this effect runs only once when the component mounts

  return (
    <div>
      <h2 style={{ textAlign: "center", color: "#333" }}>Examiners List</h2>
      
      {/* Table to display examiners */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Examiner Name</th>
            <th style={tableHeaderStyle}>Examiner ID</th>
            <th style={tableHeaderStyle}>Module Code</th>
            <th style={tableHeaderStyle}>Availability</th>
            <th style={tableHeaderStyle}>Date</th>
          </tr>
        </thead>
        <tbody>
          {examiners.map(examiner => (
            <tr key={examiner.examinerId}>
              <td style={tableCellStyle}>{examiner.examinerName}</td>
              <td style={tableCellStyle}>{examiner.examinerId}</td>
              <td style={tableCellStyle}>{examiner.moduleCode}</td>
              <td style={tableCellStyle}>{examiner.availability}</td>
              <td style={tableCellStyle}>{examiner.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Styling for the table headers and cells
const tableHeaderStyle = {
  padding: "10px",
  textAlign: "left",
  backgroundColor: "#f2f2f2",
  border: "1px solid #ddd",
};

const tableCellStyle = {
  padding: "8px",
  border: "1px solid #ddd",
};


