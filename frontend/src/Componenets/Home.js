import { useEffect, useState } from 'react'; 
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Home() {
  const [presentations, setPresentations] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state
  const navigate = useNavigate();
  
  // Get user ID from token (unchanged)
  const token = localStorage.getItem('token');
  let userId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.userId;
    } catch (err) {
      console.error("Token decoding failed:", err);
      localStorage.removeItem('token');
      navigate('/login');
    }
  } else {
    navigate('/login');
  }

  useEffect(() => {
    const fetchPresentations = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:8070/auth/presentations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log("Presentations:", res.data);
        const userRequests = res.data.filter(p => p.userId === userId);
        setPresentations(userRequests);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.message || "Failed to fetch presentations");
        
        // Handle 401 unauthorized
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchPresentations();
    }
  }, [userId, token, navigate]);

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this presentation?")) return;
    
    try {
      await axios.delete(`http://localhost:8070/auth/presentation/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Optimistic update instead of reload
      setPresentations(presentations.filter(p => p._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.response?.data?.message || "Failed to delete presentation");
      
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  }

  /* YOUR EXISTING RETURN JSX REMAINS 100% UNCHANGED */
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar - unchanged */}
      <nav className="bg-blue-500 p-4 text-white shadow-md">
        {/* ... your existing navbar code ... */}
      </nav>

      {/* Presentations Section - unchanged */}
      <div className="container mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Your Presentation Requests</h2>

        {/* Only added loading and error states */}
        {loading ? (
          <p className="text-gray-500">Loading presentations...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : presentations.length === 0 ? (
          <p className="text-gray-500">No presentations found.</p>
        ) : (
          <ul className="space-y-4">
            {presentations.map(p => (
              <li key={p._id} className="p-4 border rounded-lg flex justify-between items-center">
                {/* ... your existing presentation item JSX ... */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Home;