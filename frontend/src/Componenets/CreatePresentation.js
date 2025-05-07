import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CreatePresentation = () => {
    const [title, setTitle] = useState('');
    const [presenter, setPresenter] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [date, setDate] = useState('');
    const [examinerId, setExaminerId] = useState('');
    const [moduleCode, setModuleCode] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const formatTo12Hour = (time24) => {
        const [hour, minute] = time24.split(':');
        const hourNum = parseInt(hour, 10);
        const ampm = hourNum >= 12 ? 'PM' : 'AM';
        const hour12 = hourNum % 12 || 12;
        return `${hour12}:${minute} ${ampm}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!title || !presenter || !startTime || !endTime || !date || !examinerId || !moduleCode) {
            setError('All fields are required');
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
            setSuccessMessage('Presentation created successfully');
            toast.success('Your presentation has been created successfully.');
            setTitle('');
            setPresenter('');
            setStartTime('');
            setEndTime('');
            setDate('');
            setExaminerId('');
            setModuleCode('');
        } catch (err) {
            setError(err.response ? err.response.data.msg : 'Server error');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-slate-800/40 backdrop-blur-lg rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
                <div className="bg-gradient-to-r from-blue-600/80 to-indigo-600/80 p-5">
                    <h2 className="text-2xl font-light text-white tracking-wide text-center">New Presentation</h2>
                </div>

                <div className="p-8">
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
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Presentation Title</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-800/50 border border-slate-700/70 rounded-lg py-3 px-4 text-slate-200 placeholder-slate-500"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Presenter Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-800/50 border border-slate-700/70 rounded-lg py-3 px-4 text-slate-200 placeholder-slate-500"
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
                                    className="w-full bg-slate-800/50 border border-slate-700/70 rounded-lg py-3 px-4 text-slate-200 placeholder-slate-500"
                                    value={examinerId}
                                    onChange={(e) => setExaminerId(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Module Code</label>
                                <input
                                    type="text"
                                    placeholder="IT1234"
                                    className="w-full bg-slate-800/50 border border-slate-700/70 rounded-lg py-3 px-4 text-slate-200 placeholder-slate-500"
                                    value={moduleCode}
                                    onChange={(e) => setModuleCode(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Date</label>
                                <input
                                    type="date"
                                    className="w-full bg-slate-800/50 border border-slate-700/70 rounded-lg py-3 px-4 text-slate-200"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Start Time</label>
                                <input
                                    type="time"
                                    className="w-full bg-slate-800/50 border border-slate-700/70 rounded-lg py-3 px-4 text-slate-200"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">End Time</label>
                                <input
                                    type="time"
                                    className="w-full bg-slate-800/50 border border-slate-700/70 rounded-lg py-3 px-4 text-slate-200"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg flex items-center justify-center group"
                        >
                            <span className="group-hover:translate-x-1 transition-transform duration-300">Create Presentation</span>
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
