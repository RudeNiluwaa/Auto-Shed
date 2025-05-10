import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Swal from 'sweetalert2';

// Register fonts
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts;

export default function ExaminerList({ role }) {
  const [examiners, setExaminers] = useState([]);
  const [filteredExaminers, setFilteredExaminers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');
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
    const fetchExaminers = async () => {
      try {
        const result = await Swal.fire({
          title: 'Loading Examiners',
          html: 'Please wait while we fetch examiner data...',
          allowOutsideClick: false,
          background: '#1e293b',
          color: '#e2e8f0',
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const response = await axios.get('http://localhost:8070/examiner/');
        setExaminers(response.data);
        setFilteredExaminers(response.data);
        
        if (result.isDismissed) {
          Swal.close();
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Failed to Load',
          text: 'Could not fetch examiners. Please try again later.',
          background: '#1e293b',
          color: '#e2e8f0',
          confirmButtonColor: '#4f46e5'
        });
        console.error("Error fetching data:", error);
      }
    };

    fetchExaminers();
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
    Swal.fire({
      title: 'Confirm Deletion',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#64748b',
      background: '#1e293b',
      color: '#e2e8f0',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:8070/examiner/delete/${mongoId}`)
          .then(() => {
            setExaminers(prev => prev.filter(e => e._id !== mongoId));
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Examiner has been deleted.',
              background: '#1e293b',
              color: '#e2e8f0',
              confirmButtonColor: '#4f46e5',
              timer: 2000
            });
          })
          .catch(() => {
            Swal.fire({
              icon: 'error',
              title: 'Failed to Delete',
              text: 'Could not delete examiner. Please try again.',
              background: '#1e293b',
              color: '#e2e8f0',
              confirmButtonColor: '#4f46e5'
            });
          });
      }
    });
  };

  const handleUpdate = (examinerId) => {
    const examiner = examiners.find(e => e.examinerId === examinerId);
    if (!examiner) {
      Swal.fire({
        icon: 'error',
        title: 'Examiner Not Found',
        text: 'The examiner you are trying to edit does not exist.',
        background: '#1e293b',
        color: '#e2e8f0',
        confirmButtonColor: '#4f46e5'
      });
      return;
    }
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // First check if the examiner still exists
      const checkResponse = await axios.get(`http://localhost:8070/examiner/get/${currentExaminer._id}`);
      if (!checkResponse.data) {
        Swal.fire({
          icon: 'error',
          title: 'Examiner Not Found',
          text: 'The examiner no longer exists.',
          background: '#1e293b',
          color: '#e2e8f0',
          confirmButtonColor: '#4f46e5'
        });
        setIsEditing(false);
        return;
      }

      const response = await axios.put(`http://localhost:8070/examiner/update/${currentExaminer._id}`, currentExaminer);
      
      if (response.status === 200) {
        setExaminers(prev => prev.map(e => e._id === currentExaminer._id ? currentExaminer : e));
        setIsEditing(false);
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Examiner has been updated successfully.',
          background: '#1e293b',
          color: '#e2e8f0',
          confirmButtonColor: '#4f46e5',
          timer: 2000
        });
      }
    } catch (error) {
      console.error('Update error:', error);
      let errorMessage = 'Failed to update examiner. ';
      
      if (error.response) {
        errorMessage += error.response.data?.message || `Server responded with ${error.response.status}`;
      } else if (error.request) {
        errorMessage += 'No response from server. Please check your connection.';
      } else {
        errorMessage += error.message;
      }

      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: errorMessage,
        background: '#1e293b',
        color: '#e2e8f0',
        confirmButtonColor: '#4f46e5'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentExaminer(prev => ({ ...prev, [name]: value }));
  };

  const generatePDF = () => {
    if (filteredExaminers.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Data',
        text: 'There are no examiners to generate a report.',
        background: '#1e293b',
        color: '#e2e8f0',
        confirmButtonColor: '#4f46e5'
      });
      return;
    }

    Swal.fire({
      title: 'Generating Report',
      html: 'Please wait while we prepare your PDF...',
      allowOutsideClick: false,
      background: '#1e293b',
      color: '#e2e8f0',
      didOpen: () => {
        Swal.showLoading();
        
        try {
          // Format data for the PDF
          const tableBody = filteredExaminers.map(examiner => [
            examiner.examinerName || '',
            examiner.examinerId || '',
            examiner.moduleCode || '',
            examiner.availability || '',
            examiner.date || ''
          ]);
          
          // Insert header row
          tableBody.unshift(['Name', 'ID', 'Module', 'Availability', 'Date']);
          
          // Document definition with blue theme
          const docDefinition = {
            pageSize: 'A4',
            pageMargins: [40, 60, 40, 60],
            content: [
              { 
                text: 'Examiners Report', 
                style: 'header',
                alignment: 'center',
                margin: [0, 0, 0, 10]
              },
              { 
                text: `Generated on ${new Date().toLocaleDateString('en-GB', { 
                  day: '2-digit', month: 'long', year: 'numeric' 
                })}`, 
                style: 'subheader',
                alignment: 'center',
                margin: [0, 0, 0, 20]
              },
              {
                table: {
                  headerRows: 1,
                  widths: ['*', 'auto', 'auto', 'auto', 'auto'],
                  body: tableBody
                },
                layout: {
                  fillColor: function(rowIndex) {
                    return rowIndex === 0 ? '#3B82F6' : (rowIndex % 2 === 0 ? '#EFF6FF' : null);
                  },
                  hLineWidth: function(i) { return 1; },
                  vLineWidth: function(i) { return 1; },
                  hLineColor: function(i) { return '#BFDBFE'; },
                  vLineColor: function(i) { return '#BFDBFE'; },
                  paddingLeft: function() { return 10; },
                  paddingRight: function() { return 10; },
                  paddingTop: function() { return 8; },
                  paddingBottom: function() { return 8; }
                }
              }
            ],
            footer: function(currentPage, pageCount) {
              return {
                text: `Page ${currentPage} of ${pageCount}`,
                alignment: 'center',
                margin: [0, 10, 0, 0],
                fontSize: 8,
                color: '#64748B'
              };
            },
            styles: {
              header: {
                fontSize: 22,
                bold: true,
                color: '#1E40AF',
                decorationStyle: 'double',
                decorationColor: '#3B82F6'
              },
              subheader: {
                fontSize: 12,
                color: '#64748B'
              },
              tableHeader: {
                bold: true,
                fontSize: 11,
                color: 'white'
              }
            },
            defaultStyle: {
              fontSize: 10
            }
          };
          
          // Apply table header styles
          docDefinition.content[2].table.body[0].forEach((cell, i) => {
            docDefinition.content[2].table.body[0][i] = { 
              text: cell, 
              style: 'tableHeader'
            };
          });
          
          // Create and download the PDF
          pdfMake.createPdf(docDefinition).download('examiners-report.pdf');
          
          Swal.fire({
            icon: 'success',
            title: 'Report Generated!',
            text: 'The PDF report has been downloaded.',
            background: '#1e293b',
            color: '#e2e8f0',
            confirmButtonColor: '#4f46e5',
            timer: 2000
          });
        } catch (error) {
          console.error('Error generating report:', error);
          Swal.fire({
            icon: 'error',
            title: 'Report Failed',
            text: 'An error occurred while generating the report.',
            background: '#1e293b',
            color: '#e2e8f0',
            confirmButtonColor: '#4f46e5'
          });
        }
      }
    });
  };

  const handleNavigation = (path, message) => {
    Swal.fire({
      title: 'Confirm Navigation',
      text: message || 'Are you sure you want to proceed?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#64748b',
      background: '#1e293b',
      color: '#e2e8f0',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(path);
      }
    });
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
            <button
              onClick={generatePDF}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              Download PDF
            </button>
          </div>
        </div>

        {/* User View: Cards */}
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
          // Admin View: Table
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
                  {field === "availability" ? (
                    <select
                      name={field}
                      value={currentExaminer[field]}
                      onChange={handleChange}
                      className="w-full border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Availability</option>
                      <option value="Available">Available</option>
                      <option value="Unavailable">Unavailable</option>
                    </select>
                  ) : (
                    <input
                      type={field === "date" ? "date" : "text"}
                      name={field}
                      value={currentExaminer[field]}
                      onChange={handleChange}
                      className="w-full border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
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
              onClick={() => handleNavigation('/add-examiner', 'You will be redirected to add examiner page')}
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