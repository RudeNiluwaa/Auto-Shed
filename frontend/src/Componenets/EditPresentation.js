import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function EditPresentation() {
  const [title, setTitle] = useState('');
  const [presenter, setPresenter] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const { id } = useParams();  // Get the presentation ID from the URL
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  let userId = null;

  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.user.id;
  } else {
    navigate('/login'); // Redirect to login if not authenticated
  }

  // Fetch the presentation data when the component mounts
  useEffect(() => {
    axios.get(`http://localhost:8070/auth/presentation/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const { title, presenter, timeSlot, status } = res.data;
        setTitle(title);
        setPresenter(presenter);
        setTimeSlot(timeSlot);
        setStatus(status);
      })
      .catch(err => {
        setError('Failed to fetch presentation details');
        console.log(err);
      });
  }, [id, token]);

  // Handle the form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedPresentation = {
      title,
      presenter,
      timeSlot,
      status,
    };

    axios.put(`http://localhost:8070/auth/presentation/${id}`, updatedPresentation, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        navigate('/'); // Redirect back to the home page after successful edit
      })
      .catch(err => {
        setError('Failed to update presentation');
        console.log(err);
      });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <nav className="bg-blue-500 p-4 text-white shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Edit Presentation</h1>
        </div>
      </nav>

      <div className="container mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Edit Your Presentation</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-lg font-semibold text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-3 border rounded-md"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-lg font-semibold text-gray-700 mb-2">Presenter</label>
            <input
              type="text"
              value={presenter}
              onChange={(e) => setPresenter(e.target.value)}
              className="p-3 border rounded-md"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-lg font-semibold text-gray-700 mb-2">Time Slot</label>
            <input
              type="text"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="p-3 border rounded-md"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-lg font-semibold text-gray-700 mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="p-3 border rounded-md"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              Update Presentation
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPresentation;
