import React, { useState } from 'react';
import axios from 'axios';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8070/auth/forgot-password', { email });
            setMessage(res.data.msg);
        } catch (err) {
            console.error(err);
            setMessage('Error sending reset link');
        }
    };

    return (
        <div className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 min-h-screen flex items-center justify-center">
    <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Forgot Password</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300"
            />
            <button 
                type="submit" 
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out shadow-md"
            >
                Send Reset Link
            </button>
        </form>

        {message && <p className="mt-4 text-center text-gray-600">{message}</p>}
    </div>
</div>

    );
}

export default ForgotPassword;