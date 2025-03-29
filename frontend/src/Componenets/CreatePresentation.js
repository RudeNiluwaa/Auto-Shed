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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-700 via-blue-500 to-blue-400 p-6">
      <div className="w-full max-w-lg bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/30">
          <h2 className="text-3xl font-extrabold text-center text-white mb-6 tracking-wide">Request a Presentation</h2>
  
          {error && <div className="text-red-400 text-center mb-4 font-semibold">{error}</div>}
          {successMessage && <div className="text-green-400 text-center mb-4 font-semibold">{successMessage}</div>}
  
          <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                  <label className="block text-white font-medium mb-1" htmlFor="title">Title</label>
                  <input
                      type="text"
                      id="title"
                      className="w-full p-3 rounded-xl bg-white/30 text-black placeholder-white/50 border border-white/50 focus:ring-2 focus:ring-blue-300 focus:outline-none transition duration-300"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter title"
                  />
              </div>
  
              <div>
                  <label className="block text-white font-medium mb-1" htmlFor="presenter">Presenter</label>
                  <input
                      type="text"
                      id="presenter"
                      className="w-full p-3 rounded-xl bg-white/30 text-black placeholder-white/50 border border-white/50 focus:ring-2 focus:ring-blue-300 focus:outline-none transition duration-300"
                      value={presenter}
                      onChange={(e) => setPresenter(e.target.value)}
                      placeholder="Enter presenter name"
                  />
              </div>
  
              <div>
                  <label className="block text-white font-medium mb-1" htmlFor="timeSlot">Time Slot</label>
                  <input
                      type="text"
                      id="timeSlot"
                      className="w-full p-3 rounded-xl bg-white/30 text-black placeholder-white/50 border border-white/50 focus:ring-2 focus:ring-blue-300 focus:outline-none transition duration-300"
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      placeholder="Enter time slot"
                  />
              </div>
  
              <button 
                  type="submit" 
                  className="w-full p-3 bg-black text-white font-semibold rounded-xl shadow-lg hover:bg-white hover:text-black transition duration-300"
              >
                  Send Request
              </button> 
          </form>
      </div>
  </div>
  
  
    );
};

export default CreatePresentation;
