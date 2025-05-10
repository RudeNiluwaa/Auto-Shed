import { useEffect, useState } from 'react'; 
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

function Home() {
  const [presentations, setPresentations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  let userId = null;
  
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.user.id; 
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Session Expired',
        text: 'Your session has expired. Please log in again.',
        background: '#1e293b',
        color: '#e2e8f0',
        confirmButtonColor: '#4f46e5'
      }).then(() => {
        navigate('/login');
      });
    }
  } else {
    navigate('/login');
  }

  useEffect(() => {
    if (!token) return;
    
    const fetchPresentations = async () => {
      try {
        const result = await Swal.fire({
          title: 'Loading Presentations',
          html: 'Please wait while we fetch your presentations...',
          allowOutsideClick: false,
          background: '#1e293b',
          color: '#e2e8f0',
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const res = await axios.get('http://localhost:8070/auth/presentations', {
          headers: { Authorization: `Bearer ${token}` } 
        });
        
        const userRequests = res.data.filter(presentation => 
          presentation.user && presentation.user.toString() === userId
        );
        
        setPresentations(userRequests);
        setIsLoading(false);
        
        if (result.isDismissed) {
          Swal.close();
        }
      } catch (err) {
        setIsLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Failed to Load',
          text: 'Could not fetch your presentations. Please try again later.',
          background: '#1e293b',
          color: '#e2e8f0',
          confirmButtonColor: '#4f46e5'
        });
      }
    };

    fetchPresentations();
  }, [userId, token]);

  function handleDelete(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#64748b',
      background: '#1e293b',
      color: '#e2e8f0',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:8070/auth/presentation/${id}`, {
          headers: { Authorization: `Bearer ${token}` }  
        })
          .then(() => {
            setPresentations(prev => prev.filter(presentation => presentation._id !== id));
            Swal.fire({
              title: 'Deleted!',
              text: 'Your presentation has been deleted.',
              icon: 'success',
              background: '#1e293b',
              color: '#e2e8f0',
              confirmButtonColor: '#4f46e5',
              timer: 2000
            });
          })
          .catch(err => {
            console.error('Error deleting presentation:', err.response ? err.response.data : err.message);
            Swal.fire({
              title: 'Error!',
              text: 'Failed to delete presentation. Please try again.',
              icon: 'error',
              background: '#1e293b',
              color: '#e2e8f0',
              confirmButtonColor: '#4f46e5'
            });
          });
      }
    });
  }

  const handleNavigation = (path, message) => {
    Swal.fire({
      title: 'Confirm Navigation',
      text: message || 'Are you sure you want to proceed?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#64748b',
      background: '#1e293b',
      color: '#e2e8f0',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(path);
      }
    });
  };

  return (
    <div className="bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 min-h-screen p-6">
      <nav className="bg-white/10 backdrop-blur-lg p-4 text-white shadow-md rounded-xl">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-wider">Presentation Scheduler</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => handleNavigation('/add-reschedule', 'You will be redirected to reschedule your presentations')}
              className="bg-black text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-500 hover:text-black transition-all duration-300"
            >
              Reschedule My Presentations
            </button>
            <button 
              onClick={() => handleNavigation('/get-examiner-user', 'You will be redirected to examiner list')}
              className="bg-black text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-500 hover:text-black transition-all duration-300"
            >
              Examiner List
            </button>
            <button 
              onClick={() => handleNavigation('/createpresentation', 'You will be redirected to create a new presentation')}
              className="bg-black text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-500 hover:text-black transition-all duration-300"
            >
              + Request New Presentation
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto mt-10 p-8 bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50">
        <h2 className="text-2xl font-light text-slate-200 mb-8 tracking-wide">Your Presentations</h2>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : presentations.length === 0 ? (
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
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider ${p.status === 'Accepted' ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50' : p.status === 'Rejected' ? 'bg-rose-900/50 text-rose-300 border border-rose-700/50' : 'bg-slate-700/50 text-slate-300 border border-slate-600/50'}`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleNavigation(`/edit/${p._id}`, `You will be redirected to edit ${p.title}`)}
                      className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-600/50 hover:border-slate-500/70 transition-all duration-300"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(p._id)} 
                      className="px-4 py-2 bg-rose-900/50 hover:bg-rose-800/70 text-rose-200 rounded-lg border border-rose-800/50 hover:border-rose-700/70 transition-all duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* AI Scheduling Button */}
      <button 
        onClick={() => handleNavigation('/ai-dashboard', 'You will be redirected to AI Scheduling')}
        className="fixed right-6 bottom-6 bg-black text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-500 hover:text-black transition-all duration-300"
      >
        AI Scheduling
      </button>
    </div>
  );
}

export default Home;