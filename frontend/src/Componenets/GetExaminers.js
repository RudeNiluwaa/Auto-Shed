import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ExaminerList() {
  const [examiners, setExaminers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExaminer, setCurrentExaminer] = useState({
    examinerName: '',
    examinerId: '',
    moduleCode: '',
    availability: '',
    date: ''
  });

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

  const handleDelete = (examinerId) => {
    axios.delete("http://localhost:8070/examiner/delete/id")
      .then(() => {
        // Remove the deleted examiner from the state
        setExaminers(examiners.filter(examiner => examiner.examinerId !== examinerId));
        alert('Examiner deleted successfully');
      })
      .catch(error => {
        console.error("Error deleting examiner:", error);
        alert('Failed to delete examiner');
      });
  };

  const handleUpdate = (examinerId) => {
    const examiner = examiners.find(examiner => examiner.examinerId === examinerId);
    setCurrentExaminer(examiner);
    setIsEditing(true);
  };
  
  const handleEditSubmit = (e) => {
    e.preventDefault();
    // Use MongoDB _id for the update URL
    axios.put(`http://localhost:8070/examiner/update/${currentExaminer._id}`, currentExaminer)
      .then(response => {
        const updatedExaminers = examiners.map(examiner =>
          examiner._id === currentExaminer._id ? currentExaminer : examiner
        );
        setExaminers(updatedExaminers);
        setIsEditing(false);
        alert('Examiner updated successfully');
      })
      .catch(error => {
        console.error("Error updating examiner:", error);
        alert('Failed to update examiner');
      });
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentExaminer({ ...currentExaminer, [name]: value });
  };

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
            <th style={tableHeaderStyle}>Actions</th>
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
              <td style={tableCellStyle}>
                <button onClick={() => handleUpdate(examiner.examinerId)} style={buttonStyle}>Update</button>
                <button onClick={() => handleDelete(examiner.examinerId)} style={buttonStyle}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Update Form */}
      {isEditing && (
        <div style={formContainerStyle}>
          <h3>Edit Examiner</h3>
          <form onSubmit={handleEditSubmit}>
            <label>Examiner Name:</label>
            <input
              type="text"
              name="examinerName"
              value={currentExaminer.examinerName}
              onChange={handleChange}
              style={inputStyle}
            />
            <label>Examiner ID:</label>
            <input
              type="text"
              name="examinerId"
              value={currentExaminer.examinerId}
              onChange={handleChange}
              disabled
              style={inputStyle}
            />
            <label>Module Code:</label>
            <input
              type="text"
              name="moduleCode"
              value={currentExaminer.moduleCode}
              onChange={handleChange}
              style={inputStyle}
            />
            <label>Availability:</label>
            <input
              type="text"
              name="availability"
              value={currentExaminer.availability}
              onChange={handleChange}
              style={inputStyle}
            />
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={currentExaminer.date}
              onChange={handleChange}
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>Update</button>
            <button type="button" onClick={() => setIsEditing(false)} style={cancelButtonStyle}>Cancel</button>
          </form>
        </div>
      )}
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

const buttonStyle = {
  padding: "8px 12px",
  margin: "5px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const formContainerStyle = {
  width: "300px",
  margin: "auto",
  padding: "20px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  backgroundColor: "#f9f9f9",
  marginTop: "20px"
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  margin: "5px 0",
  borderRadius: "4px",
  border: "1px solid #ddd"
};

const cancelButtonStyle = {
  padding: "8px 12px",
  margin: "5px",
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};





