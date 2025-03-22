import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';
import AddExaminer from './Componenets/AddExaminer';
import GetExaminer from './Componenets/GetExaminer';

function App() {
  return (

    <BrowserRouter>
    
    <Routes>
      <Route path='/add' element={<AddExaminer />} />
      <Route path='/' element={<GetExaminer />} />
    </Routes>
    </BrowserRouter>
     
  );
}

export default App;
