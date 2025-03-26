import { useEffect, useState } from 'react'; 
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Home() {
  const [presentations, setPresentations] = useState([]);
  const navigate = useNavigate();
  
  // Get user ID from token
  const token = localStorage.getItem('token');
  let userId = null;
  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.userId; // Ensure your token contains 'userId'
  } else {
    navigate('/login'); // Redirect to login if not authenticated
  }

  useEffect(() => {
    axios.get('http://localhost:8070/auth/presentations', {
      headers: { Authorization: `Bearer ${token}` } // Send token for authentication
    })
      .then(res => {
        console.log("Presentations:", res.data);
        const userRequests = res.data.filter(p => p.userId === userId);
        setPresentations(userRequests);
      })
      .catch(err => console.log(err));
  }, [userId, token]);

  function handleDelete(id) {
    axios.delete(`http://localhost:8070/auth/presentation/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
      .then(() => window.location.reload())
      .catch(err => console.log(err));
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <nav className="bg-blue-500 p-4 text-white shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Presentation Scheduler</h1>
          <Link to="/createpresentation" className="bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-blue-100">
            Create Presentation
          </Link>
        </div>
      </nav>

      {/* Presentations Section */}
      <div className="container mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Your Presentation Requests</h2>

        {presentations.length === 0 ? (
          <p className="text-gray-500">No presentations found.</p>
        ) : (
          <ul className="space-y-4">
            {presentations.map(p => (
              <li key={p._id} className="p-4 border rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="text-gray-600">Presenter: {p.presenter}</p>
                  <p className="text-gray-500">Time Slot: {p.timeSlot}</p>
                </div>
                <div className="space-x-2">
                  <Link to={`/edit/${p._id}`} className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600">
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(p._id)} 
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Home;
