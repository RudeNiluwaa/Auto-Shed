import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function EditPresentation() {
  const [formData, setFormData] = useState({
    title: '',
    presenter: '',
    timeSlot: '',
    status: ''
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/home');
  }

  useEffect(() => {
    axios.get(`http://localhost:8070/auth/presentation/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const { title, presenter, timeSlot, status } = res.data;
        setFormData({ title, presenter, timeSlot, status });
      })
      .catch(err => {
        setError('Failed to fetch presentation details');
        console.log(err);
      });
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    
    if (!formData.presenter.trim()) {
      newErrors.presenter = 'Presenter name is required';
    }
    
    if (!formData.timeSlot.trim()) {
      newErrors.timeSlot = 'Time slot is required';
    } else if (!/^([0-24]{1,2}:[0-59]{2} (AM|PM)) - ([0-24]{1,2}:[0-59]{2} (AM|PM))$/.test(formData.timeSlot)) {
      newErrors.timeSlot = 'Please use HH:MM format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    axios.put(`http://localhost:8070/auth/presentation/${id}`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => navigate('/home'))
      .catch(err => {
        setError(err.response?.data?.msg || 'Failed to update presentation');
        console.log(err);
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Premium Header */}
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 shadow-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-light text-white tracking-tight">Edit Presentation</h1>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto mt-10 p-8 bg-slate-800/70 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-700/50">
        <h2 className="text-2xl font-light text-slate-200 mb-6 tracking-wide">Edit Your Presentation</h2>

        {error && (
          <div className="mb-6 p-3 bg-rose-900/30 text-rose-300 rounded-lg border border-rose-800/50 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">
                Presentation Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full bg-slate-800/50 border ${errors.title ? 'border-rose-500' : 'border-slate-700/70'} rounded-lg py-3 px-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all duration-200`}
                  placeholder="Presentation title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-rose-400">{errors.title}</p>
                )}
              </div>
            </div>

            {/* Presenter Field */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">
                Presenter Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="presenter"
                  value={formData.presenter}
                  onChange={handleChange}
                  className={`w-full bg-slate-800/50 border ${errors.presenter ? 'border-rose-500' : 'border-slate-700/70'} rounded-lg py-3 px-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all duration-200`}
                  placeholder="Presenter name"
                />
                {errors.presenter && (
                  <p className="mt-1 text-sm text-rose-400">{errors.presenter}</p>
                )}
              </div>
            </div>

            {/* Time Slot Field */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">
                Time Slot (HH:MM)
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleChange}
                  className={`w-full bg-slate-800/50 border ${errors.timeSlot ? 'border-rose-500' : 'border-slate-700/70'} rounded-lg py-3 px-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all duration-200`}
                  placeholder="14:30"
                />
                {errors.timeSlot && (
                  <p className="mt-1 text-sm text-rose-400">{errors.timeSlot}</p>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition duration-300 flex items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                <>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Update Presentation</span>
                  <svg className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="px-6 py-2.5 border border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white font-medium rounded-lg transition-all duration-300"
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
