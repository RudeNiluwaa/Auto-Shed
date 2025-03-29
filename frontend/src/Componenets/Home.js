import { useEffect, useState } from 'react'; 
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Home() {
  // All state and logic remains EXACTLY the same
  const [presentations, setPresentations] = useState([]);
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  let userId = null;
  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.user.id; 
  } else {
    navigate('/login');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Premium Navbar */}
      <nav className="bg-slate-800/70 backdrop-blur-lg p-5 rounded-xl shadow-xl border border-slate-700/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-light text-white tracking-tight">
            Presentation Scheduler
          </h1>
          <Link 
            to="/createpresentation" 
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Presentation
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto mt-10 p-8 bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50">
        <h2 className="text-2xl font-light text-slate-200 mb-8 tracking-wide">
          Your Presentations
        </h2>

        {presentations.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-slate-300">No presentations found</h3>
            <p className="mt-1 text-sm text-slate-500">Create your first presentation to get started</p>
          </div>
        ) : (
          <ul className="space-y-5">
            {presentations.map(p => (
              <li 
                key={p._id} 
                className="p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-slate-200">{p.title}</h3>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                      <p className="text-slate-400 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium text-slate-300">Presenter:</span> {p.presenter}
                      </p>
                      <p className="text-slate-400 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium text-slate-300">Time:</span> {p.timeSlot}
                      </p>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider
                      ${p.status === 'Accepted' ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50' : 
                        p.status === 'Rejected' ? 'bg-rose-900/50 text-rose-300 border border-rose-700/50' : 
                        'bg-slate-700/50 text-slate-300 border border-slate-600/50'}`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <Link 
                      to={`/edit/${p._id}`} 
                      className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-600/50 hover:border-slate-500/70 transition-all duration-300 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(p._id)} 
                      className="px-4 py-2 bg-rose-900/50 hover:bg-rose-800/70 text-rose-200 rounded-lg border border-rose-800/50 hover:border-rose-700/70 transition-all duration-300 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
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