import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';
import AddExaminer from './Componenets/AddExaminer';
import GetExaminers from './Componenets/GetExaminers';
import Home from './Componenets/Home';
import CreatePresentation from './Componenets/CreatePresentation';
import EditPresentation from './Componenets/EditPresentation';


function App() {
  return (

    <BrowserRouter>
    
    <Routes>
    <Route path="/" element={<Home />} />
        <Route path="/createpresentation" element={<CreatePresentation />} />
        <Route path="/edit/:id" element={<EditPresentation />} />
      <Route path='/add-examiner' element={<AddExaminer />} />
      <Route path='/get-examiner' element={<GetExaminers />} />
    </Routes>
    </BrowserRouter>
     
  );
}

export default App;
