import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Email validation function
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if the email is valid
        if (!isValidEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        try {
            const res = await axios.post('http://localhost:8070/auth/register', { username, email, password });
            localStorage.setItem('token', res.data.token);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.msg || 'Something went wrong');
        }
    };

    return (
<div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-300 to-blue-600">
    <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-8 rounded-3xl shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-extrabold text-center text-white mb-8 tracking-tight">Create Your Account</h1>

        {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 shadow-lg text-sm font-medium">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-6 py-4 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-300 bg-gray-100 text-black placeholder-gray-500 shadow-lg hover:shadow-xl"
            />

            <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-6 py-4 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-300 bg-gray-100 text-black placeholder-gray-500 shadow-lg hover:shadow-xl"
            />

            <input
                type="password"
                placeholder="Password (8+ characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-6 py-4 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-300 bg-gray-100 text-black placeholder-gray-500 shadow-lg hover:shadow-xl"
            />

            <div className="flex items-center space-x-3">
                <input type="checkbox" required id="terms" className="h-5 w-5 text-blue-500" />
                <label htmlFor="terms" className="text-sm text-gray-700">
                    I agree to the <span className="text-blue-500">Terms of Service</span> & <span className="text-blue-500">Privacy Policy</span>
                </label>
            </div>

            <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 active:bg-gray-800 transition-all duration-300 ease-in-out shadow-lg transform hover:scale-105"
            >
                Create Account
            </button>
        </form>

        <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="text-blue-500 hover:underline font-semibold">
                    Log in
                </a>
            </p>
        </div>
    </div>
</div>

    );
}

export default Register;
