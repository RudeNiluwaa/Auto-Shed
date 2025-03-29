import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Admin() {
    const [presentations, setPresentations] = useState([]);
    const navigate = useNavigate(); 

    useEffect(() => {
        axios.get('http://localhost:8070/auth/admin/presentations', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => setPresentations(res.data))
        .catch(err => console.error('Error fetching presentations:', err));
    }, []);

    const updateStatus = (id, newStatus) => {
        axios.put(`http://localhost:8070/auth/admin/presentation/status/${id}`, 
        { status: newStatus }, 
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
        .then(() => {
            // Update the status immediately in the UI
            setPresentations(prev => prev.map(p => 
                p._id === id ? { ...p, status: newStatus } : p
            ));
        })
        .catch(err => console.error('Error updating status:', err));
    };

    return (
        <div className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 min-h-screen">
        <nav className="bg-blue-600 p-6 text-white shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
                <button
            onClick={() => navigate('/add-examiner')}
            className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-100 transition"
          >
            Add Examiner
          </button>
            </div>
        </nav>
    
        <div className="container mx-auto mt-10 p-8 bg-white rounded-3xl shadow-xl">
            <h2 className="text-3xl font-semibold mb-8 text-gray-800">All Presentations</h2>
    
            {presentations.length === 0 ? (
                <p className="text-gray-500 text-lg">No presentations found.</p>
            ) : (
                <ul className="space-y-6">
                    {presentations.map(p => (
                        <li key={p._id} className="p-6 border-2 border-gray-200 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-sm hover:shadow-2xl">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">{p.title}</h3>
                                <p className="text-gray-600">Presenter: {p.presenter}</p>
                                <p className="text-gray-500">Time Slot: {p.timeSlot}</p>
                                <p className={`inline-block px-4 py-1 rounded-md text-sm font-semibold 
                                    ${p.status === 'Accepted' ? 'bg-green-500' : p.status === 'Rejected' ? 'bg-red-500' : 'bg-gray-400'}`}
                                >
                                    {p.status}
                                </p>
                            </div>
                            <div className="space-x-4 mt-4">
                                <button 
                                    onClick={() => updateStatus(p._id, 'Accepted')} 
                                    className="bg-green-500 text-white px-5 py-2 rounded-full transition duration-300 ease-in-out transform hover:bg-green-600 hover:scale-105 shadow-md"
                                >
                                    Accept
                                </button>
                                <button 
                                    onClick={() => updateStatus(p._id, 'Rejected')} 
                                    className="bg-red-500 text-white px-5 py-2 rounded-full transition duration-300 ease-in-out transform hover:bg-red-600 hover:scale-105 shadow-md"
                                >
                                    Reject
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

export default Admin;
