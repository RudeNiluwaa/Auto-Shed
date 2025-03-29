import React, {useState} from 'react';
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
import AddSchedule from './Componenets/AddSchedule'
import GetSchedules from './Componenets/GetSchedules';
import UpdateReschedule from './Componenets/UpdateReschedule';

function App() {

  const [role, setRole] = useState("user")
  return (

    <BrowserRouter>
    
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path='/admin' element={<Admin/>} />
      <Route path="/createpresentation" element={<CreatePresentation />} />
      <Route path="/edit/:id" element={<EditPresentation />} />
      <Route path='/add-examiner' element={<AddExaminer />} />
      <Route path='/get-examiner-user' element={<GetExaminers role="user" />} />
      <Route path='/get-examiner-admin' element={<GetExaminers role="admin" />} />
      <Route path='/register' element={<Register/>} />
      <Route path='/pass-reset' element={<PassReset/>} />
      <Route path='/forgot-pass' element={<ForgotPass/>} />
      <Route path='/add-reschedule' element={<AddSchedule />} />
      <Route path='/get-reschedule-user' element={<GetSchedules role="user" />} />
      <Route path='/get-reschedule-admin' element={<GetSchedules role="admin" />} />
      <Route path='/update-reschedule/:id' element={<UpdateReschedule />} />
      
    </Routes>
    </BrowserRouter>
     
  );
}

export default App;
