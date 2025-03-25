import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8070/examiner/')
      .then(response => {
        setExaminers(response.data);  
      })
      .catch(error => {
        console.error("There was an error fetching the examiners data:", error);
      });
  }, []);  

  const handleDelete = (examinerId, mongoId) => {  
    axios.delete(`http://localhost:8070/examiner/delete/${mongoId}`)  
      .then(() => {
        setExaminers(examiners.filter(examiner => examiner._id !== mongoId));
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
    setErrors({});  
    setIsEditing(true);
  };

  const validateForm = () => {
    let errors = {};
    const nameRegex = /^[A-Za-z ]+$/;
    const idRegex = /^E\d{4}$/;
    const moduleRegex = /^(IT|SE|CS|DS|ISE|CSNE)(1|2|3|4)[0-9]{2}0$/;
    const today = new Date().toISOString().split("T")[0]; 

    // Validate examiner name
    if (!currentExaminer.examinerName.trim()) errors.examinerName = "Examiner name is required";
    else if (!nameRegex.test(currentExaminer.examinerName)) errors.examinerName = "Only letters and spaces allowed";

    // Validate examiner ID
    if (!currentExaminer.examinerId.trim()) errors.examinerId = "Examiner ID is required";
    else if (!idRegex.test(currentExaminer.examinerId)) errors.examinerId = "Alphanumeric only (no special characters)";

    // Validate module code
    if (!currentExaminer.moduleCode.trim()) errors.moduleCode = "Module code is required";
    else if (!moduleRegex.test(currentExaminer.moduleCode)) errors.moduleCode = "Module code format is invalid. It should be like IT2010, CS4050, SE2030.";

    // Validate availability
    if (!currentExaminer.availability.trim()) errors.availability = "Availability is required";
    else if (!["Available", "Unavailable"].includes(currentExaminer.availability)) errors.availability = "Must be 'Available' or 'Unavailable'";

    // Validate date
    if (!currentExaminer.date) errors.date = "Date is required";
    else if (currentExaminer.date < today) errors.date = "Date cannot be in the past";

    setErrors(errors);  
    return Object.keys(errors).length === 0; 
};

  
  

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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

  const handleAddExaminer = () => {
    navigate('/add-examiner'); 
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", color: "#333" }}>Examiners List</h2>

      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button onClick={handleAddExaminer} style={buttonStyle}>
          Add Examiner
        </button>
      </div>

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
                <button onClick={() => handleDelete(examiner.examinerId, examiner._id)} style={buttonStyle}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isEditing && (
        <div style={formContainerStyle}>
          <h3>Edit Examiner</h3>
          <form onSubmit={handleEditSubmit}>
            <label>Examiner Name:</label>
            <input type="text" name="examinerName" value={currentExaminer.examinerName} onChange={handleChange} style={inputStyle} />
            {errors.examinerName && <p style={{ color: 'red' }}>{errors.examinerName}</p>}

            <label>Examiner ID:</label>
            <input type="text" name="examinerId" value={currentExaminer.examinerId} onChange={handleChange} disabled style={inputStyle} />
            
            <label>Module Code:</label>
            <input type="text" name="moduleCode" value={currentExaminer.moduleCode} onChange={handleChange} style={inputStyle} />
            {errors.moduleCode && <p style={{ color: 'red' }}>{errors.moduleCode}</p>}

            <label>Availability:</label>
            <input type="text" name="availability" value={currentExaminer.availability} onChange={handleChange} style={inputStyle} />
            {errors.availability && <p style={{ color: 'red' }}>{errors.availability}</p>}

            <label>Date:</label>
            <input type="date" name="date" value={currentExaminer.date} onChange={handleChange} style={inputStyle} />
            {errors.date && <p style={{ color: 'red' }}>{errors.date}</p>}
            
            <button type="submit" style={buttonStyle}>Update</button>
            <button type="button" onClick={() => setIsEditing(false)} style={cancelButtonStyle}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}

const buttonStyle = {
  padding: '8px 12px',
  margin: '5px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const cancelButtonStyle = {
  ...buttonStyle,
  backgroundColor: 'red',
};

const tableHeaderStyle = {
  border: '1px solid #ddd',
  padding: '8px',
  backgroundColor: '#f2f2f2',
  textAlign: 'left',
};

const tableCellStyle = {
  border: '1px solid #ddd',
  padding: '8px',
};

const formContainerStyle = {
  maxWidth: '400px',
  margin: '20px auto',
  padding: '20px',
  border: '1px solid #ddd',
  borderRadius: '5px',
  backgroundColor: '#f9f9f9',
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  margin: '5px 0',
  border: '1px solid #ccc',
  borderRadius: '4px',
};








