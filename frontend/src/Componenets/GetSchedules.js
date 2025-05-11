import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Swal from "sweetalert2"; // Import Swal

export default function GetSchedules({ role }) {
  const [reschedules, setReschedules] = useState([]);
  const [filteredReschedules, setFilteredReschedules] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8070/reschedule")
      .then((response) => {
        setReschedules(response.data);
        setFilteredReschedules(response.data);
      })
      .catch((error) => {
        console.error("Error fetching reschedule details:", error);
      });
  }, []);

  const handleDelete = async (id) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e11d48', // red
    cancelButtonColor: '#64748B', // gray
    confirmButtonText: 'Yes, delete it!',
    background: '#1e293b',
    color: '#e2e8f0'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8070/reschedule/delete/${id}`);
        const updated = reschedules.filter((reschedule) => reschedule._id !== id);
        setReschedules(updated);
        setFilteredReschedules(updated);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The reschedule has been deleted.',
          background: '#1e293b',
          color: '#e2e8f0',
          confirmButtonColor: '#4f46e5',
          timer: 2000
        });
      } catch (error) {
        console.error("Error deleting request:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete the reschedule.',
          background: '#1e293b',
          color: '#e2e8f0',
          confirmButtonColor: '#4f46e5'
        });
      }
    }
  });
};


 const handleUpdate = (id) => {
  Swal.fire({
    title: 'Are you sure?',
    text: "You are about to update this reschedule request.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, update it!'
  }).then((result) => {
    if (result.isConfirmed) {
      navigate(`/update-reschedule/${id}`);
    }
  });
};

  const handleAddSchedule = () => {
    navigate("/add-reschedule");
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = reschedules.filter((item) =>
      item.userId.toLowerCase().includes(term) ||
      item.examinerId.toLowerCase().includes(term) ||
      item.module_code.toLowerCase().includes(term)
    );
    setFilteredReschedules(filtered);
  };

  const generatePDF = () => {
    if (filteredReschedules.length === 0) {  // Use filteredReschedules here
      Swal.fire({
        icon: 'warning',
        title: 'No Data',
        text: 'There are no reschedules to generate a report.',
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
          const tableBody = filteredReschedules.map(reschedule => [
            reschedule.userId || '',
            reschedule.examinerId || '',
            reschedule.module_code || '',
            reschedule.current_date || '',
            reschedule.req_date || ''
          ]);

          // Insert header row
          tableBody.unshift(['User ID', 'Examiner ID', 'Module Code', 'Current Date', 'Requested Date']);

          // Document definition with blue theme
          const docDefinition = {
            pageSize: 'A4',
            pageMargins: [40, 60, 40, 60],
            content: [
              { 
                text: 'Reschedule Report', 
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
          pdfMake.createPdf(docDefinition).download('reschedules-report.pdf');

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

  return (
    <div className="flex justify-center items-start min-h-screen bg-gradient-to-br from-blue-950 to-blue-800 py-6">
      <div className="w-full max-w-full overflow-auto bg-white/10 shadow-md border border-gray-300 p-4 rounded-lg">
        <h2 className="text-4xl font-extrabold text-center tracking-wide mb-10 uppercase text-white drop-shadow ">Reschedule Details</h2>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
          {role === "user" && (
            <button
              onClick={handleAddSchedule}
              className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
            >
              Add Schedule
            </button>
          )}
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="🔍 Search by User ID, Examiner ID or Module Code"
            className="mx-auto w-full md:w-[50%] max-w-md px-4 py-2 rounded-md border border-white/40 bg-white/10 text-white placeholder-white/70 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={generatePDF}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            Download PDF
          </button>
        </div>
       <div className="overflow-x-auto">
  <table className="min-w-[1500px] w-full border-collapse border border-gray-300 bg-white/60 shadow-md backdrop-blur-md text-lg">

            <thead className="bg-gray-300/10 text-white font-bold text-xl">

              <tr>
                <th className="border border-gray-400 p-2">User ID</th>
                <th className="border border-gray-400 p-2">Examiner ID</th>
                <th className="border border-gray-400 p-2">Module Code</th>
                <th className="border border-gray-400 p-2">Current Date</th>
                <th className="border border-gray-400 p-2">Requested Date</th>
                <th className="border border-gray-400 p-2">Current Time</th>
                <th className="border border-gray-400 p-2">Requested Time</th>
                <th className="border border-gray-400 p-2">Current Venue</th>
                <th className="border border-gray-400 p-2">Requested Venue</th>
                {role === "admin" && <th className="border border-gray-400 p-2">Actions</th>}
              </tr>
            </thead>
            <tbody className="text-lg">

              {filteredReschedules.map((reschedule) => (
                <tr key={reschedule._id} className="text-center border-b border-gray-300 bg-white/10 hover:bg-white/20 text-white font-bold transition">
                  <td className="border border-gray-300 p-2">{reschedule.userId}</td>
                  <td className="border border-gray-300 p-2">{reschedule.examinerId}</td>
                  <td className="border border-gray-300 p-2">{reschedule.module_code}</td>
                  <td className="border border-gray-300 p-2">{reschedule.current_date}</td>
                  <td className="border border-gray-300 p-2">{reschedule.req_date}</td>
                  <td className="border border-gray-300 p-2">{reschedule.current_time}</td>
                  <td className="border border-gray-300 p-2">{reschedule.req_time}</td>
                  <td className="border border-gray-300 p-2">{reschedule.current_venue}</td>
                  <td className="border border-gray-300 p-2">{reschedule.req_venue}</td>
                  {role === "admin" && (
                    <td className="border border-gray-300 p-2">
                      <button
  onClick={() => handleUpdate(reschedule._id)}
  className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600 mr-2"
>
  Update
</button>
<button
  onClick={() => handleDelete(reschedule._id)}
  className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600"
>
  Delete
</button>

                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}








