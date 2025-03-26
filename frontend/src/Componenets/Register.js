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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>

                {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    <input
                        type="password"
                        placeholder="Password (at least 8+ characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    <div className="flex items-center space-x-2">
                        <input type="checkbox" required id="terms" className="h-4 w-4 text-blue-500" />
                        <label htmlFor="terms" className="text-sm text-gray-700">
                            I agree with the Terms of Use & Privacy Policy
                        </label>
                    </div>

                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                        Create Account
                    </button>
                </form>

                <div className="text-center mt-4">
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-500 hover:underline">
                        Log in
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Register;
