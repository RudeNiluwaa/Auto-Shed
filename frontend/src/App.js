import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';
import AddExaminer from './Componenets/AddExaminer';
import GetExaminers from './Componenets/GetExaminers';

function App() {
  return (

    <BrowserRouter>
    
    <Routes>
      <Route path='/add' element={<AddExaminer />} />
      <Route path='/get' element={<GetExaminers />} />
    </Routes>
    </BrowserRouter>
     
  );
}

export default App;
