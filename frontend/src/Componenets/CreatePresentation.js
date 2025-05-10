import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const CreatePresentation = () => {
    const [title, setTitle] = useState('');
    const [presenter, setPresenter] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [date, setDate] = useState('');
    const [examinerId, setExaminerId] = useState('');
    const [moduleCode, setModuleCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formatTo12Hour = (time24) => {
        const [hour, minute] = time24.split(':');
        const hourNum = parseInt(hour, 10);
        const ampm = hourNum >= 12 ? 'PM' : 'AM';
        const hour12 = hourNum % 12 || 12;
        return `${hour12}:${minute} ${ampm}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!title || !presenter || !startTime || !endTime || !date || !examinerId || !moduleCode) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'All fields are required!',
                background: '#1e293b',
                color: '#e2e8f0',
                confirmButtonColor: '#4f46e5'
            });
            setIsSubmitting(false);
            return;
        }

        const timeSlotFormatted = `${formatTo12Hour(startTime)} - ${formatTo12Hour(endTime)}`;
        const token = localStorage.getItem('token');

        try {
            await axios.post(
                'http://localhost:8070/auth/create',
                { title, presenter, timeSlot: timeSlotFormatted, date, examinerId, moduleCode },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Presentation created successfully',
                background: '#1e293b',
                color: '#e2e8f0',
                confirmButtonColor: '#4f46e5',
                timer: 5000,
                timerProgressBar: true
            });

            // Reset form
            setTitle('');
            setPresenter('');
            setStartTime('');
            setEndTime('');
            setDate('');
            setExaminerId('');
            setModuleCode('');

            window.location.href="http://localhost:3000/home"

        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.response ? err.response.data.msg : 'Server error',
                background: '#1e293b',
                color: '#e2e8f0',
                confirmButtonColor: '#4f46e5'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
            <div className="w-full max-w-4xl bg-slate-800/40 backdrop-blur-lg rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
                <div className="bg-gradient-to-r from-blue-600/80 to-indigo-600/80 p-5">
                    <h2 className="text-2xl font-light text-white tracking-wide text-center">New Presentation</h2>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Presentation Title</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-800/50 border border-slate-700/70 rounded-lg py-3 px-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Presenter Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-800/50 border border-slate-700/70 rounded-lg py-3 px-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                                    value={presenter}
                                    onChange={(e) => setPresenter(e.target.value)}
                                    placeholder="Enter presenter"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Examiner ID</label>
                                <input
                                    type="text"
                                    placeholder="E1234"
                                    className="w-full bg-slate-800/50 border border-slate-700/70 rounded-lg py-3 px-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                                    value={examinerId}
                                    onChange={(e) => setExaminerId(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Module Code</label>
                                <input
                                    type="text"
                                    placeholder="IT1234"
                                    className="w-full bg-slate-800/50 border border-slate-700/70 rounded-lg py-3 px-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                                    value={moduleCode}
                                    onChange={(e) => setModuleCode(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Date</label>
                                <input
                                    type="date"
                                    className="w-full bg-slate-800/50 border border-slate-700/70 rounded-lg py-3 px-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Start Time</label>
                                    <input
                                        type="time"
                                        className="w-full bg-slate-800/50 border border-slate-700/70 rounded-lg py-3 px-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">End Time</label>
                                    <input
                                        type="time"
                                        className="w-full bg-slate-800/50 border border-slate-700/70 rounded-lg py-3 px-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg flex items-center justify-center group transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-blue-500 hover:to-indigo-500'}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <span className="group-hover:translate-x-1 transition-transform duration-300">Create Presentation</span>
                                    <svg className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePresentation;