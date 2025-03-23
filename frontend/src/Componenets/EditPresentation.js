import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditPresentation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [presentation, setPresentation] = useState({
    title: '',
    presenter: '',
    timeSlot: '',
  });

  // Fetch existing presentation details
  useEffect(() => {
    axios.get(`http://localhost:8070/presentation/${id}`)
      .then(res => setPresentation(res.data))
      .catch(err => console.log(err));
  }, [id]);

  // Handle input changes
  function handleChange(e) {
    setPresentation({ ...presentation, [e.target.name]: e.target.value });
  }

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault();
    axios.put(`http://localhost:8070/presentation/update/${id}`, presentation)
      .then(() => navigate('/'))
      .catch(err => console.log(err));
  }

  return (
    <div>
      <h1>Edit Presentation</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" value={presentation.title} onChange={handleChange} required />
        <input type="text" name="presenter" value={presentation.presenter} onChange={handleChange} required />
        <input type="text" name="timeSlot" value={presentation.timeSlot} onChange={handleChange} required />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default EditPresentation;
