import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Admin() {
    const [presentations, setPresentations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8070/auth/admin/presentations', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => setPresentations(res.data))
        .catch(err => console.error('Error fetching presentations:', err));
    }, []);

    const updateStatus = (id, newStatus) => {
        axios.put(`http://localhost:8070/auth/admin/presentation/status/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
        .then(() => {
            setPresentations(prev => prev.map(p =>
                p._id === id ? { ...p, status: newStatus } : p
            ));
        })
        .catch(err => console.error('Error updating status:', err));
    };

    const generateReport = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Presentation Report', 14, 20);  // Title of the document
    
        const tableColumn = ['Title', 'Presenter', 'Time Slot', 'Examiner ID', 'Module Code', 'Date', 'Status'];
        const tableRows = [];
    
        // Prepare data for the table rows
        presentations.forEach(p => {
            const rowData = [
                p.title || '',
                p.presenter || '',
                p.timeSlot || '',
                p.examiner?.examinerId || 'N/A',
                p.examiner?.moduleCode || 'N/A',
                new Date(p.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                p.status
            ];
            tableRows.push(rowData);
        });
    
        const startY = 30; // Starting vertical position for the table (below the title)
        const rowHeight = 14; // Increased row height for more space
        const columnWidth = 40; // Increased column width for more room
        const marginLeft = 14; // Left margin for the text
    
        // Draw the table headers with more space after the title
        doc.setFontSize(12);
        tableColumn.forEach((header, index) => {
            const x = marginLeft + index * columnWidth; // Horizontal position of the header
            doc.text(header, x, startY);
        });
    
        // Draw a horizontal line after the headers
        doc.setLineWidth(0.5);
        doc.line(marginLeft, startY + 3, marginLeft + columnWidth * tableColumn.length, startY + 3);
    
        // Draw the table rows
        let rowY = startY + rowHeight + 6; // Increased space between rows
        tableRows.forEach(row => {
            row.forEach((cell, index) => {
                const x = marginLeft + index * columnWidth; // Horizontal position for each cell
                doc.text(cell, x, rowY); // Add cell content to the row
            });
            rowY += rowHeight + 8; // Increased space between rows
        });
    
        doc.save('presentation-report.pdf');
    };
    

    return (
        <div className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 min-h-screen">
            <nav className="bg-blue-600 p-6 text-white shadow-lg">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => navigate('/get-reschedule-admin')}
                            className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-100 transition"
                        >
                            Reschedule Requests
                        </button>
                        <button
                            onClick={() => navigate('/add-examiner')}
                            className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-100 transition"
                        >
                            Add Examiner
                        </button>
                        <button
                            onClick={generateReport}
                            className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-100 transition"
                        >
                            Generate Report
                        </button>
                    </div>
                </div>
            </nav>

            {/* Search and Filters */}
            <div className="p-6 bg-gray-800 border-b border-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <input
                    type="text"
                    placeholder="Search presentations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/2 p-3 text-sm rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <div className="flex gap-2 flex-wrap">
                    {['All', 'Pending', 'Accepted', 'Rejected'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 text-sm rounded-lg transition-all duration-150 font-medium shadow ${
                                statusFilter === status
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-10">
                <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700">
                    {presentations.length === 0 ? (
                        <div className="p-16 text-center bg-gray-800/90">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-700/50 mb-4">
                                <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-200">No presentations available</h3>
                            <p className="mt-2 text-sm text-gray-400 max-w-md mx-auto">
                                Submitted presentations will appear here for review.
                            </p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-700">
                            {presentations
                                .filter(p => {
                                    const examinerId = p.examiner?.examinerId || '';
                                    const moduleCode = p.examiner?.moduleCode || '';
                                    const date = new Date(p.date).toLocaleDateString('en-GB', {
                                        day: '2-digit', month: 'short', year: 'numeric'
                                    });

                                    const text = `${p.title} ${p.presenter} ${p.timeSlot} ${examinerId} ${moduleCode} ${date}`.toLowerCase();
                                    const matchesSearch = text.includes(searchTerm.toLowerCase());
                                    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;

                                    return matchesSearch && matchesStatus;
                                })
                                .map(p => (
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
                                                                <span className="font-medium text-gray-300 mr-1">Presenter:</span> {p.presenter}
                                                            </div>
                                                            <div className="flex items-center text-gray-400">
                                                                <span className="font-medium text-gray-300 mr-1">Time Slot:</span> {p.timeSlot}
                                                            </div>
                                                            <div className="flex items-center text-gray-400">
                                                                <span className="font-medium text-gray-300 mr-1">Examiner ID:</span> {p.examiner?.examinerId || 'N/A'}
                                                            </div>
                                                            <div className="flex items-center text-gray-400">
                                                                <span className="font-medium text-gray-300 mr-1">Module Code:</span> {p.examiner?.moduleCode || 'N/A'}
                                                            </div>
                                                            <div className="flex items-center text-gray-400">
                                                                <span className="font-medium text-gray-300 mr-1">Date:</span> 
                                                                {new Date(p.date).toLocaleDateString('en-GB', {
                                                                    day: '2-digit', month: 'short', year: 'numeric'
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-shrink-0 gap-3">
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
