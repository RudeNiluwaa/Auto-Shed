import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Swal from 'sweetalert2';


// Register fonts - fix for webpack bundling
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts;

function Admin() {
    const [presentations, setPresentations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPresentations = async () => {
            try {
                const result = await Swal.fire({
                    title: 'Loading Data',
                    html: 'Fetching presentations...',
                    allowOutsideClick: false,
                    background: '#1e293b',
                    color: '#e2e8f0',
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                const res = await axios.get('http://localhost:8070/auth/admin/presentations', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                
                setPresentations(res.data);
                setIsLoading(false);
                
                if (result.isDismissed) {
                    Swal.close();
                }
            } catch (err) {
                setIsLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to Load',
                    text: 'Could not fetch presentations. Please try again later.',
                    background: '#1e293b',
                    color: '#e2e8f0',
                    confirmButtonColor: '#4f46e5'
                });
                console.error('Error fetching presentations:', err);
            }
        };

        fetchPresentations();
    }, []);

    const updateStatus = (id, newStatus) => {
        axios.put(`http://localhost:8070/auth/admin/presentation/status/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
        .then(() => {
            setPresentations(prev => prev.map(p =>
                p._id === id ? { ...p, status: newStatus } : p
            ));

            Swal.fire({
                icon: 'success',
                title: 'Status Updated!',
                text: `Presentation has been ${newStatus.toLowerCase()}.`,
                background: '#1e293b',
                color: '#e2e8f0',
                confirmButtonColor: '#4f46e5',
                timer: 2000
            });
        })
        .catch(err => {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'Failed to update presentation status. Please try again.',
                background: '#1e293b',
                color: '#e2e8f0',
                confirmButtonColor: '#4f46e5'
            });
            console.error('Error updating status:', err);
        });
    };

    const generateReport = () => {
        if (presentations.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'No Data',
                text: 'There are no presentations to generate a report.',
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
            didOpen: async () => {
                Swal.showLoading();
                
                try {
                    // Format data for the PDF
                    const tableBody = presentations.map(p => [
                        p.title || '',
                        p.presenter || '',
                        p.timeSlot || '',
                        p.examiner?.examinerId || 'N/A',
                        p.examiner?.moduleCode || 'N/A',
                        new Date(p.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                        p.status
                    ]);
                    
                    // Insert header row
                    tableBody.unshift(['Title', 'Presenter', 'Time Slot', 'Examiner ID', 'Module Code', 'Date', 'Status']);
                    
                    // Define styling for different status values
                    const getStatusColor = (status) => {
                        switch(status) {
                            case 'Accepted': return '#10B981'; // emerald-500
                            case 'Rejected': return '#F43F5E'; // rose-500
                            case 'Pending': return '#FBBF24';  // amber-400
                            default: return '#71717A';         // gray-500
                        }
                    };
                    
                    // Document definition with light blue theme
                    const docDefinition = {
                        pageSize: 'A4',
                        pageMargins: [40, 60, 40, 60],
                        background: function() {
                            return {
                                canvas: [
                                    {
                                        type: 'rect',
                                        x: 0, y: 0,
                                        w: 595.28, h: 20,
                                        color: '#DBEAFE' // bg-blue-100
                                    }
                                ]
                            };
                        },
                        content: [
                            { 
                                text: 'Presentations Report', 
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
                                    widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
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
                    
                    // Apply table header styles and color status cells
                    docDefinition.content[2].table.body.forEach((row, rowIndex) => {
                        if (rowIndex === 0) {
                            row.forEach((cell, i) => {
                                docDefinition.content[2].table.body[0][i] = { 
                                    text: cell, 
                                    style: 'tableHeader',
                                    fillColor: '#3B82F6'
                                };
                            });
                        } else {
                            const statusCell = row[6];
                            docDefinition.content[2].table.body[rowIndex][6] = {
                                text: statusCell,
                                color: getStatusColor(statusCell)
                            };
                        }
                    });
                    
                    // Create and download the PDF
                    pdfMake.createPdf(docDefinition).download('presentation-report.pdf');
                    
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
                    Swal.fire({
                        icon: 'error',
                        title: 'Report Failed',
                        text: 'An error occurred while generating the report.',
                        background: '#1e293b',
                        color: '#e2e8f0',
                        confirmButtonColor: '#4f46e5'
                    });
                    console.error('Error generating report:', error);
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

    // Filter and search presentations
    const filteredPresentations = presentations.filter(p => {
        const matchesSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              p.presenter?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleLogout = () => {
        Swal.fire({
            title: 'Confirm Logout',
            text: 'Are you sure you want to log out?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#64748b',
            background: '#1e293b',
            color: '#e2e8f0',
            confirmButtonText: 'Yes, log out!'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                navigate('/');
            }
        });
    };

    return (
        <div className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 min-h-screen">
            {/* Navbar */}
            <nav className="bg-blue-600 p-6 text-white shadow-lg">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
                    
                    <div className="flex space-x-4">
                        <button
                            onClick={() => handleNavigation('/get-reschedule-admin', 'You will be redirected to reschedule requests')}
                            className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-100 transition"
                        >
                            Reschedule Requests
                        </button>
                        <button
                            onClick={() => handleNavigation('/add-examiner', 'You will be redirected to add examiner page')}
                            className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-100 transition"
                        >
                            Add Examiner
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Search and Filter Controls */}
            <div className="max-w-7xl mx-auto px-8 pt-6">
                <div className="bg-gray-800 rounded-xl shadow-xl p-4 flex flex-wrap gap-4 mb-6">
                    <div className="flex-1 min-w-[200px]">
                        <input
                            type="text"
                            placeholder="Search presentations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                        <button
                            onClick={generateReport}
                            className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Generate Report
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-8 pb-10">
                <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700">
                    {isLoading ? (
                        <div className="p-16 text-center bg-gray-800/90">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-700/50 mb-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                            <h3 className="text-lg font-medium text-gray-200">Loading presentations...</h3>
                        </div>
                    ) : filteredPresentations.length === 0 ? (
                        <div className="p-16 text-center bg-gray-800/90">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-700/50 mb-4">
                                <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-200">No presentations available</h3>
                            <p className="mt-2 text-sm text-gray-400 max-w-md mx-auto">
                                {searchTerm || statusFilter !== 'All' ? 
                                "No presentations match your current filters." :
                                "Submitted presentations will appear here for review."}
                            </p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-700">
                            {filteredPresentations.map(p => (
                                <li key={p._id} className="p-8 hover:bg-gray-700/30 transition-colors duration-200">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start gap-5">
                                                <div className={`flex-shrink-0 mt-1 h-3 w-3 rounded-full 
                                                    ${p.status === 'Accepted' ? 'bg-emerald-400' : 
                                                      p.status === 'Rejected' ? 'bg-rose-400' : 
                                                      'bg-amber-300'}`} />
                                                <div>
                                                    <h3 className="text-lg font-normal text-gray-100 leading-snug">{p.title}</h3>
                                                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-3 text-sm">
                                                        <div className="flex items-center text-gray-400">
                                                            <svg className="flex-shrink-0 mr-2 h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                            <span className="font-medium text-gray-300 mr-1">Presenter:</span> {p.presenter}
                                                        </div>
                                                        <div className="flex items-center text-gray-400">
                                                            <svg className="flex-shrink-0 mr-2 h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span className="font-medium text-gray-300 mr-1">Time Slot:</span> {p.timeSlot}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-shrink-0 gap-3">
                                            {p.status === 'Pending' && (
                                                <>
                                                    <button
                                                        onClick={() => updateStatus(p._id, 'Accepted')}
                                                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition-all duration-150 shadow-lg"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => updateStatus(p._id, 'Rejected')}
                                                        className="px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-200 bg-gray-700 hover:bg-gray-600 transition-all duration-150 shadow-lg"
                                                    >
                                                        Decline
                                                    </button>
                                                </>
                                            )}
                                            {p.status !== 'Pending' && (
                                                <div className={`px-4 py-2 text-sm font-medium rounded-md ${
                                                    p.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                                }`}>
                                                    {p.status}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Admin;