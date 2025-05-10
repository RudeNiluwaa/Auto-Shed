import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ExaminerList({ role }) {
  const [examiners, setExaminers] = useState([]);
  const [filteredExaminers, setFilteredExaminers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name'); // name, id, module, date
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
        setFilteredExaminers(response.data);
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const filtered = examiners.filter(examiner => {
      const searchValue = searchTerm.toLowerCase();
      switch(searchType) {
        case 'name':
          return examiner.examinerName.toLowerCase().includes(searchValue);
        case 'id':
          return examiner.examinerId.toLowerCase().includes(searchValue);
        case 'module':
          return examiner.moduleCode.toLowerCase().includes(searchValue);
        case 'date':
          return examiner.date.includes(searchValue);
        default:
          return true;
      }
    });
    setFilteredExaminers(filtered);
  }, [searchTerm, searchType, examiners]);

  const handleDelete = (examinerId, mongoId) => {
    axios.delete(`http://localhost:8070/examiner/delete/${mongoId}`)
      .then(() => {
        setExaminers(prev => prev.filter(e => e._id !== mongoId));
        alert('Examiner deleted successfully');
      })
      .catch(() => alert('Failed to delete examiner'));
  };

  const handleUpdate = (examinerId) => {
    const examiner = examiners.find(e => e.examinerId === examinerId);
    setCurrentExaminer(examiner);
    setErrors({});
    setIsEditing(true);
  };

  const validateForm = () => {
    const errors = {};
    const nameRegex = /^[A-Za-z ]+$/;
    const idRegex = /^E\d{4}$/;
    const moduleRegex = /^(IT|SE|CS|DS|ISE|CSNE)[1-4]\d{3}$/;
    const today = new Date().toISOString().split("T")[0];

    if (!currentExaminer.examinerName.trim()) errors.examinerName = "Examiner name is required";
    else if (!nameRegex.test(currentExaminer.examinerName)) errors.examinerName = "Only letters and spaces allowed";

    if (!currentExaminer.examinerId.trim()) errors.examinerId = "Examiner ID is required";
    else if (!idRegex.test(currentExaminer.examinerId)) errors.examinerId = "Invalid ID (e.g., E1234)";

    if (!currentExaminer.moduleCode.trim()) errors.moduleCode = "Module code is required";
    else if (!moduleRegex.test(currentExaminer.moduleCode)) errors.moduleCode = "Invalid format (e.g., IT2010)";

    if (!currentExaminer.availability.trim()) errors.availability = "Availability is required";
    else if (!["Available", "Unavailable"].includes(currentExaminer.availability)) errors.availability = "Must be 'Available' or 'Unavailable'";

    if (!currentExaminer.date) errors.date = "Date is required";
    else if (currentExaminer.date < today) errors.date = "Date cannot be in the past";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    axios.put(`http://localhost:8070/examiner/update/${currentExaminer._id}`, currentExaminer)
      .then(() => {
        setExaminers(prev => prev.map(e => e._id === currentExaminer._id ? currentExaminer : e));
        setIsEditing(false);
        alert('Examiner updated successfully');
      })
      .catch(() => alert('Failed to update examiner'));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentExaminer(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-800 text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center tracking-wide mb-10 uppercase text-white drop-shadow">Examiners List</h2>

        {/* Search Bar */}
        <div className="mb-8 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="bg-white/20 text-white border border-white/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Search by Name</option>
              <option value="id">Search by ID</option>
              <option value="module">Search by Module</option>
              <option value="date">Search by Date</option>
            </select>
            <input
              type={searchType === 'date' ? 'date' : 'text'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search by ${searchType}...`}
              className="w-full md:w-96 bg-white/20 text-white border border-white/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white/50"
            />
          </div>
        </div>

        {/* ✅ User View: Cards */}
        {role !== 'admin' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExaminers.map((examiner) => (
              <div
                key={examiner._id}
                className="bg-white text-black rounded-2xl shadow-xl p-6 transition-all hover:shadow-2xl hover:scale-105 duration-300"
              >
                <h3 className="text-xl font-bold mb-2">{examiner.examinerName}</h3>
                <p className="text-gray-700"><span className="font-medium">Examiner ID:</span> {examiner.examinerId}</p>
                <p className="text-gray-700"><span className="font-medium">Module:</span> {examiner.moduleCode}</p>
                <p className="text-gray-700"><span className="font-medium">Availability:</span> {examiner.availability}</p>
                <p className="text-gray-700"><span className="font-medium">Date:</span> {examiner.date}</p>
              </div>
            ))}
          </div>
        ) : (
          // ✅ Admin View: Table
          <div className="overflow-x-auto rounded-xl shadow-2xl">
            <table className="min-w-full bg-white text-black rounded-xl overflow-hidden">
              <thead className="bg-blue-700 text-white">
                <tr>
                  {["Name", "ID", "Module", "Availability", "Date"].map(head => (
                    <th key={head} className="px-6 py-3 text-sm font-semibold uppercase border border-gray-200">{head}</th>
                  ))}
                  {role === 'admin' && <th className="px-6 py-3 text-sm font-semibold uppercase border border-gray-200">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredExaminers.map(examiner => (
                  <tr key={examiner.examinerId} className="even:bg-gray-100">
                    <td className="px-4 py-2 border border-gray-300">{examiner.examinerName}</td>
                    <td className="px-4 py-2 border border-gray-300">{examiner.examinerId}</td>
                    <td className="px-4 py-2 border border-gray-300">{examiner.moduleCode}</td>
                    <td className="px-4 py-2 border border-gray-300">{examiner.availability}</td>
                    <td className="px-4 py-2 border border-gray-300">{examiner.date}</td>
                    {role === 'admin' && (
                      <td className="px-4 py-2 border border-gray-300 space-x-2">
                        <button onClick={() => handleUpdate(examiner.examinerId)} className="bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded-md transition">Update</button>
                        <button onClick={() => handleDelete(examiner.examinerId, examiner._id)} className="bg-blue-800 hover:bg-blue-900 text-white px-3 py-1 rounded-md transition">Delete</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Admin Edit Form */}
        {isEditing && (
          <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg text-black">
            <h3 className="text-xl font-semibold mb-4">Edit Examiner</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {["examinerName", "examinerId", "moduleCode", "availability", "date"].map(field => (
                <div key={field}>
                  <label className="block font-medium capitalize">{field.replace("examiner", "Examiner ")}:</label>
                  <input
                    type={field === "date" ? "date" : "text"}
                    name={field}
                    value={currentExaminer[field]}
                    onChange={handleChange}
                    className="w-full border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors[field] && <p className="text-red-600 text-sm mt-1">{errors[field]}</p>}
                </div>
              ))}
              <div className="flex justify-between">
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Update</button>
                <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-800 text-white px-4 py-2 rounded">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Admin Add Button */}
        <div className="mt-12 text-center">
          {role === 'admin' && (
            <button 
              onClick={() => navigate('/add-examiner')} 
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200"
            >
              Add Examiner
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
