import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

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

    const validateForm = () => {
        const newErrors = {};
        
        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }
        
        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        
        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])/.test(formData.password)) {
            newErrors.password = 'Password must contain uppercase, number, and special character';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        
        try {
            const res = await axios.post('http://localhost:8070/auth/register', formData);
            localStorage.setItem('token', res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-6">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-light text-white tracking-tight mb-2">Create Account</h1>
                    <p className="text-slate-300">Join us today</p>
                </div>

                {error && (
                    <div className="bg-rose-900/50 text-rose-100 p-3 rounded-lg mb-6 border border-rose-800/50 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-white/5 text-white border ${
                                    errors.username ? 'border-rose-500' : 'border-slate-600/50'
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent placeholder-slate-400 transition duration-200`}
                                placeholder="Enter username"
                            />
                            {errors.username && (
                                <p className="mt-1 text-sm text-rose-400">{errors.username}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-white/5 text-white border ${
                                    errors.email ? 'border-rose-500' : 'border-slate-600/50'
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent placeholder-slate-400 transition duration-200`}
                                placeholder="your@email.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-rose-400">{errors.email}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-white/5 text-white border ${
                                    errors.password ? 'border-rose-500' : 'border-slate-600/50'
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent placeholder-slate-400 transition duration-200`}
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-rose-400">{errors.password}</p>
                            )}
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <div className="text-xs text-slate-500">
                                    {formData.password.length}/8
                                </div>
                            </div>
                        </div>
                        <div className="mt-2 text-xs text-slate-400">
                            Must contain: uppercase, number, special character
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                required
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600/50 rounded bg-white/5"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="terms" className="text-slate-300">
                                I agree to the <span className="text-blue-400 hover:underline cursor-pointer">Terms</span> and <span className="text-blue-400 hover:underline cursor-pointer">Privacy Policy</span>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition duration-300 flex justify-center items-center ${
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
                        ) : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-400">
                    Already have an account?{' '}
                    <Link to="/" className="font-medium text-blue-400 hover:text-blue-300 transition duration-200">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Register;