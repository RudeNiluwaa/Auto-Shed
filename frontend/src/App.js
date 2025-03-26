import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';

//Pamada Pages
import AddExaminer from './Componenets/AddExaminer';
import GetExaminers from './Componenets/GetExaminers';

//Vinuvi pages
import AddRechedule from './Componenets/AddSchedule';
import GetSchedules from './Componenets/GetSchedules';
import UpdateSchedule from './Componenets/UpdateSchedule';
function App() {
  return (

    <BrowserRouter>
    
    <Routes>
      {/* Pamada Routes */}
      <Route path='/add-examiner' element={<AddExaminer />} />
      <Route path='/get-examiner' element={<GetExaminers />} />

      {/* Vinuvi Routes */}
      <Route path='/add-reschedule' element={<AddRechedule />} />
      <Route path='/get-reschedule' element={<GetSchedules />} />
      <Route path='/update-reschedule/:id' element={<UpdateSchedule />} />


      
    </Routes>
    </BrowserRouter>
     
  );
}

export default App;
