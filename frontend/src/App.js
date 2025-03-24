import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';

//Pamada Pages
import AddExaminer from './Componenets/AddExaminer';
import GetExaminers from './Componenets/GetExaminers';

//Vinuvi pages
import AddRechedule from './Componenets/AddSchedule';
import GetSchedules from './Componenets/GetSchedules';

function App() {
  return (

    <BrowserRouter>
    
    <Routes>
      {/* Pamada Roures */}
      <Route path='/add-examiner' element={<AddExaminer />} />
      <Route path='/get-examiner' element={<GetExaminers />} />

      {/* Vinuvi Routes */}
      <Route path='/add-reschedule' element={<AddRechedule />} />
      <Route path='/get-reschedule' element={<GetSchedules />} />


      
    </Routes>
    </BrowserRouter>
     
  );
}

export default App;
