import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Admin() {
    const [presentations, setPresentations] = useState([]);
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

    return ( 
        <div className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 min-h-screen">
            {/* Navbar */}
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
                    </div>
                </div>
            </nav>

            {/* Main Content */}
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
                            {presentations.map(p => (
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
