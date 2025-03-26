import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function CreatePresentation() {
  const [title, setTitle] = useState('');
  const [presenter, setPresenter] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const navigate = useNavigate();

  // Get user ID from token
  const token = localStorage.getItem('token');
  let userId = null;
  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.userId; // Ensure your token contains 'userId'
  } else {
    navigate('/login');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8070/auth/create', {
        title, presenter, timeSlot, userId // Send userId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate('/'); // Redirect after creation
    } catch (err) {
      console.error('Error creating presentation:', err);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Create Presentation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <input 
          type="text" placeholder="Presenter" value={presenter} onChange={(e) => setPresenter(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <input 
          type="text" placeholder="Time Slot" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Create</button>
      </form>
    </div>
  );
}

export default CreatePresentation;
