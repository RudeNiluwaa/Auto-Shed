import React, { useState } from 'react';
import axios from 'axios';

const CreatePresentation = () => {
    // All state and logic remains EXACTLY the same
    const [title, setTitle] = useState('');
    const [presenter, setPresenter] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !presenter || !timeSlot) {
            setError('All fields are required');
            return;
        }
        
        // Regular expression for time slot format (e.g., "10:00 AM - 11:00 AM")
        const timeSlotRegex = /^([0-24]{1,2}:[0-59]{2} (AM|PM)) - ([0-24]{1,2}:[0-59]{2} (AM|PM))$/;
        if (!timeSlotRegex.test(timeSlot)) {
            setError('Time slot must be in the format "HH:MM AM/PM - HH:MM AM/PM"');
            return;
        }

        const token = localStorage.getItem('token');
        try {
            await axios.post(
                'http://localhost:8070/auth/create', 
                { title, presenter, timeSlot },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setSuccessMessage('Presentation created successfully');
            setTitle('');
            setPresenter('');
            setTimeSlot('');
        } catch (err) {
            setError(err.response ? err.response.data.msg : 'Server error');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
            {/* Premium Glass Card */}
            <div className="w-full max-w-md bg-slate-800/40 backdrop-blur-lg rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
                {/* Gradient Header Bar */}
                <div className="bg-gradient-to-r from-blue-600/80 to-indigo-600/80 p-5">
                    <h2 className="text-2xl font-light text-white tracking-wide text-center">
                        New Presentation
                    </h2>
                </div>

                <div className="p-8">
                    {/* Status Messages */}
                    {error && (
                        <div className="mb-6 p-3 bg-rose-900/30 text-rose-300 rounded-lg border border-rose-800/50 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}
                    {successMessage && (
                        <div className="mb-6 p-3 bg-emerald-900/30 text-emerald-300 rounded-lg border border-emerald-800/50 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Input Group */}
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">
                                    Presentation Title
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full bg-slate-800/50 border border-slate-700/70 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 rounded-lg py-3 px-4 text-slate-200 placeholder-slate-500 transition-all duration-200"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter presentation title"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">
                                    Presenter Name
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full bg-slate-800/50 border border-slate-700/70 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 rounded-lg py-3 px-4 text-slate-200 placeholder-slate-500 transition-all duration-200"
                                        value={presenter}
                                        onChange={(e) => setPresenter(e.target.value)}
                                        placeholder="Enter presenter's name"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">
                                    Time Slot
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full bg-slate-800/50 border border-slate-700/70 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 rounded-lg py-3 px-4 text-slate-200 placeholder-slate-500 transition-all duration-200"
                                        value={timeSlot}
                                        onChange={(e) => setTimeSlot(e.target.value)}
                                        placeholder="e.g., 10:00 AM - 11:00 AM"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center group"
                        >
                            <span className="group-hover:translate-x-1 transition-transform duration-300">
                                Create Presentation
                            </span>
                            <svg className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePresentation;
