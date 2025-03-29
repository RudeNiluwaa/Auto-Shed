import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';

//Pamada Pages
import AddExaminer from './Componenets/AddExaminer';
import GetExaminers from './Componenets/GetExaminers';
import Home from './Componenets/Home';
import CreatePresentation from './Componenets/CreatePresentation';
import EditPresentation from './Componenets/EditPresentation';
import Login from './Componenets/Login'
import Register from './Componenets/Register'
import PassReset from './Componenets/PassReset'
import ForgotPass from './Componenets/ForgotPass'
import Admin from './Componenets/Admin'

function App() {
  return (

    <BrowserRouter>
    
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path='/admin' element={<Admin/>} />
      <Route path="/createpresentation" element={<CreatePresentation />} />
      <Route path="/edit/:id" element={<EditPresentation />} />
      <Route path='/add-examiner' element={<AddExaminer />} />
      <Route path='/get-examiner' element={<GetExaminers />} />
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register/>} />
      <Route path='/pass-reset' element={<PassReset/>} />
      <Route path='/forgot-pass' element={<ForgotPass/>} />
      
    </Routes>
    </BrowserRouter>
     
  );
}

export default App;
