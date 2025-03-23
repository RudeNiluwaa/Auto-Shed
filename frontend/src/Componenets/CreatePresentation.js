import { useState } from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreatePresentation() {
  const [title, setTitle] = useState('');
  const [presenter, setPresenter] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    axios.post('http://localhost:8070/presentation/create', { title, presenter, timeSlot })
      .then(() => navigate('/'))
      .catch(err => console.log(err));
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Request Time-slot for Presentation</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input 
              type="text" 
              placeholder="Enter title" 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Presenter Name</label>
            <input 
              type="text" 
              placeholder="Enter presenter's name" 
              value={presenter} 
              onChange={e => setPresenter(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Time Slot</label>
            <input 
              type="text" 
              placeholder="Enter time slot (e.g., 10:00 AM)" 
              value={timeSlot} 
              onChange={e => setTimeSlot(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePresentation;
