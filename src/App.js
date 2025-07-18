import React from 'react';
import { BrowserRouter , Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import "@fontsource/roboto"; 
import './App.css';
import NavBar from './componants/NavBar.jsx';
import ListCourses from './componants/ListCourses.jsx';
import AddCourses from './componants/AddCourses.jsx';
import Home from './componants/Home.jsx';
import BulkAdd from './componants/BulkAdd.jsx';

function App() {
  return (
    <div className="App">
   
      <BrowserRouter>
      <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all" element={<ListCourses />} />
          <Route path="/add" element={<AddCourses />} />
          <Route path="/bulk" element={<BulkAdd />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
