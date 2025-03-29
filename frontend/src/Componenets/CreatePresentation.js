import React, { useState } from 'react';
import axios from 'axios';

const CreatePresentation = () => {
    const [formData, setFormData] = useState({
        title: '',
        presenter: '',
        timeSlot: ''
    });
    const [errors, setErrors] = useState({});
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        
        // Title validation
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length < 5) {
            newErrors.title = 'Title must be at least 5 characters';
        }
        
        // Presenter validation
        if (!formData.presenter.trim()) {
            newErrors.presenter = 'Presenter name is required';
        } else if (formData.presenter.length < 3) {
            newErrors.presenter = 'Name must be at least 3 characters';
        }
        
        // Time slot validation
        if (!formData.timeSlot.trim()) {
            newErrors.timeSlot = 'Time slot is required';
        } else if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]/.test(formData.timeSlot)) {
            newErrors.timeSlot = 'Please use HH:MM format (e.g., 14:30)';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        
        const token = localStorage.getItem('token');
        try {
            await axios.post(
                'http://localhost:8070/auth/create', 
                formData,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setSuccessMessage('Presentation created successfully');
            setFormData({ title: '', presenter: '', timeSlot: '' });
        } catch (err) {
            setError(err.response ? err.response.data.msg : 'Server error');
        } finally {
            setIsSubmitting(false);
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
                                        name="title"
                                        className={`w-full bg-slate-800/50 border ${
                                            errors.title ? 'border-rose-500' : 'border-slate-700/70'
                                        } rounded-lg py-3 px-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all duration-200`}
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Enter presentation title"
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-sm text-rose-400">{errors.title}</p>
                                    )}
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
                                        name="presenter"
                                        className={`w-full bg-slate-800/50 border ${
                                            errors.presenter ? 'border-rose-500' : 'border-slate-700/70'
                                        } rounded-lg py-3 px-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all duration-200`}
                                        value={formData.presenter}
                                        onChange={handleChange}
                                        placeholder="Enter presenter's name"
                                    />
                                    {errors.presenter && (
                                        <p className="mt-1 text-sm text-rose-400">{errors.presenter}</p>
                                    )}
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">
                                    Time Slot (HH:MM)
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="timeSlot"
                                        className={`w-full bg-slate-800/50 border ${
                                            errors.timeSlot ? 'border-rose-500' : 'border-slate-700/70'
                                        } rounded-lg py-3 px-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all duration-200`}
                                        value={formData.timeSlot}
                                        onChange={handleChange}
                                        placeholder="14:30"
                                    />
                                    {errors.timeSlot && (
                                        <p className="mt-1 text-sm text-rose-400">{errors.timeSlot}</p>
                                    )}
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
                            disabled={isSubmitting}
                            className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition duration-300 flex items-center justify-center ${
                                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                                        Create Presentation
                                    </span>
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