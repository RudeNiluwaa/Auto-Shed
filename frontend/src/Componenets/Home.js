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
    userId = decoded.user.id; 
  } else {
    navigate('/login'); // Redirect to login if not authenticated
  }

  useEffect(() => {
    axios.get('http://localhost:8070/auth/presentations', {
      headers: { Authorization: `Bearer ${token}` } 
    })
      .then(res => {
        const userRequests = res.data.filter(presentation => 
          presentation.user && presentation.user.toString() === userId
        );
        setPresentations(userRequests);
      })
      .catch(err => console.log(err));
  }, [userId, token]);

  function handleDelete(id) {
    axios.delete(`http://localhost:8070/auth/presentation/${id}`, {
      headers: { Authorization: `Bearer ${token}` }  
    })
      .then(response => {
        setPresentations(prev => prev.filter(presentation => presentation._id !== id));
      })
      .catch(err => {
        console.error('Error deleting presentation:', err.response ? err.response.data : err.message);
      });
  }

  return (
<div className="bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 min-h-screen p-6">
    {/* Navbar */}
    <nav className="bg-white/10 backdrop-blur-lg p-4 text-white shadow-md rounded-xl">
        <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-wider">Presentation Scheduler</h1>
            <div className="flex items-center space-x-4">
            <Link 
    to="/add-reschedule" 
    className="bg-black text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-500 hover:text-black transition-all duration-300"
  >
    Reschedule My Presentations
  </Link>
  <Link 
    to="/get-examiner-user" 
    className="bg-black text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-500 hover:text-black transition-all duration-300"
  >
    Examiner List
  </Link>
  <Link 
    to="/createpresentation" 
    className="bg-black text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-500 hover:text-black transition-all duration-300"
  >
    + Request New Presentation
  </Link>
</div>
        </div>
    </nav>

    {/* Presentations Section */}
    <div className="container mx-auto mt-10 p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 tracking-wide">Your Presentations</h2>

        {presentations.length === 0 ? (
            <p className="text-gray-300 text-lg text-center">No presentations found.</p>
        ) : (
            <ul className="space-y-6">
                {presentations.map(p => (
                    <li key={p._id} className="p-5 bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl flex justify-between items-center shadow-md hover:shadow-lg transition-all duration-300">
                        <div>
                            <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                            <p className="text-gray-200">Presenter: <span className="font-medium">{p.presenter}</span></p>
                            <p className="text-gray-300">Time Slot: <span className="font-medium">{p.timeSlot}</span></p>
                            <p className={`text-white px-4 py-2 mt-2 inline-block font-semibold rounded-lg tracking-wide shadow-md
                                ${p.status === 'Accepted' ? 'bg-green-500' : p.status === 'Rejected' ? 'bg-red-500' : 'bg-gray-500'}`}
                            >
                                {p.status}
                            </p>
                        </div>
                        <div className="space-x-3">
                            <Link to={`/edit/${p._id}`} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300">
                                Edit
                            </Link>
                            <button 
                                onClick={() => handleDelete(p._id)} 
                                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition-all duration-300"
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
