import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8070/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);

            if (res.data.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'Invalid login credentials. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 p-6">
        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
            <h2 className="text-3xl font-bold mb-4 text-center text-white">Hi, Welcome Back</h2>
            <p className="text-gray-300 mb-6 text-center">Enter your credentials to continue</p>
    
            {error && <div className="bg-red-500 text-white p-3 rounded-lg mb-4">{error}</div>}
    
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-white/20 text-white border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-300"
                    />
                </div>
    
                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter at least 8+ characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-white/20 text-white border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-300"
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-3 text-sm text-gray-300"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                </div>
    
                <div className="text-right">
                    <Link to="/forgot-pass" className="text-blue-300 text-sm hover:underline">
                        Forgot Password?
                    </Link>
                </div>
    
                <button
                    type="submit"
                    className="w-full bg-black text-white py-3 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
                >
                    Login
                </button>
            </form>
    
            <div className="text-center mt-6 text-gray-300">
                Don’t have an account?{' '}
                <Link to="/register" className="text-blue-300 hover:underline">
                    Sign up
                </Link>
            </div>
        </div>
    </div>
    
    );
}

export default Login;
