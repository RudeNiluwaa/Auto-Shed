import React, { useState } from 'react';
import axios from 'axios';

const CreatePresentation = () => {
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

        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        console.log(localStorage.getItem('token'));

        try {
            const response = await axios.post(
                'http://localhost:8070/auth/create', 
                { title, presenter, timeSlot },
                { 
                    headers: { 
                        'Authorization': `Bearer ${token}`
                    }
                }
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
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Create a Presentation</h2>

                {error && <div className="text-red-500 mb-4">{error}</div>}
                {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="presenter">Presenter</label>
                        <input
                            type="text"
                            id="presenter"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={presenter}
                            onChange={(e) => setPresenter(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="timeSlot">Time Slot</label>
                        <input
                            type="text"
                            id="timeSlot"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={timeSlot}
                            onChange={(e) => setTimeSlot(e.target.value)}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Create Presentation
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePresentation;
