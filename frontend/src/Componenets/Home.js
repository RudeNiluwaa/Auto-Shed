import { useEffect, useState } from 'react'; 
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Home() {
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
    if (!token) return;
    
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
      .then(() => {
        setPresentations(prev => prev.filter(presentation => presentation._id !== id));
      })
      .catch(err => {
        console.error('Error deleting presentation:', err.response ? err.response.data : err.message);
      });
  }

  return (
    <div className="bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 min-h-screen p-6">
      <nav className="bg-white/10 backdrop-blur-lg p-4 text-white shadow-md rounded-xl">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-wider">Presentation Scheduler</h1>
          <div className="flex items-center space-x-4">
            <Link to="/add-reschedule" className="bg-black text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-500 hover:text-black transition-all duration-300">Reschedule My Presentations</Link>
            <Link to="/get-examiner-user" className="bg-black text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-500 hover:text-black transition-all duration-300">Examiner List</Link>
            <Link to="/createpresentation" className="bg-black text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-500 hover:text-black transition-all duration-300">+ Request New Presentation</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto mt-10 p-8 bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50">
        <h2 className="text-2xl font-light text-slate-200 mb-8 tracking-wide">Your Presentations</h2>

        {presentations.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-2 text-lg font-medium text-slate-300">No presentations found</h3>
            <p className="mt-1 text-sm text-slate-500">Create your first presentation to get started</p>
          </div>
        ) : (
          <ul className="space-y-5">
            {presentations.map(p => (
              <li key={p._id} className="p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300 shadow-md hover:shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-slate-200">{p.title}</h3>
                    <p className="text-slate-400">Presenter: {p.presenter}</p>
                    <p className="text-slate-400">Time: {p.timeSlot}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider ${p.status === 'Accepted' ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50' : p.status === 'Rejected' ? 'bg-rose-900/50 text-rose-300 border border-rose-700/50' : 'bg-slate-700/50 text-slate-300 border border-slate-600/50'}`}>{p.status}</span>
                  </div>
                  <div className="flex gap-3">
                    <Link to={`/edit/${p._id}`} className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-600/50 hover:border-slate-500/70 transition-all duration-300">Edit</Link>
                    <button onClick={() => handleDelete(p._id)} className="px-4 py-2 bg-rose-900/50 hover:bg-rose-800/70 text-rose-200 rounded-lg border border-rose-800/50 hover:border-rose-700/70 transition-all duration-300">Delete</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>


   {/* AI Scheduling Button */}
   <button 
   onClick={() => navigate('/ai-dashboard')} 
   className="fixed right-6 bottom-6 bg-black text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-500 hover:text-black transition-all duration-300"
 >
   AI Scheduling
 </button>
</div>
);
}

export default Home;
