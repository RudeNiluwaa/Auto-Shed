import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
  const [presentations, setPresentations] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8070/presentation/all')
      .then(res => setPresentations(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1>Scheduled Presentations</h1>
      <Link to="/createpresentation"><button>Create New Presentation</button></Link>
      <ul>
        {presentations.map(p => (
          <li key={p._id}>
            {p.title} - {p.presenter} ({p.timeSlot}) 
            <Link to={`/edit/${p._id}`}><button>Edit</button></Link>
            <button onClick={() => handleDelete(p._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function handleDelete(id) {
  axios.delete(`http://localhost:8070/presentation/delete/${id}`)
    .then(() => window.location.reload())
    .catch(err => console.log(err));
}

export default Home;
