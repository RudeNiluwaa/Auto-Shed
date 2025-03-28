import { useEffect, useState } from 'react';
import axios from 'axios';

function Admin() {
    const [presentations, setPresentations] = useState([]);

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
        <div className="bg-gray-100 min-h-screen">
            <nav className="bg-blue-500 p-4 text-white shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                </div>
            </nav>

            <div className="container mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">All Presentations</h2>

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
                                    <p className={`text-white px-2 py-1 rounded-md 
                                        ${p.status === 'Accepted' ? 'bg-green-500' : p.status === 'Rejected' ? 'bg-red-500' : 'bg-gray-400'}`}
                                    >
                                        {p.status}
                                    </p>
                                </div>
                                <div className="space-x-2">
                                    <button 
                                        onClick={() => updateStatus(p._id, 'Accepted')} 
                                        className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                                    >
                                        Accept
                                    </button>
                                    <button 
                                        onClick={() => updateStatus(p._id, 'Rejected')} 
                                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
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
