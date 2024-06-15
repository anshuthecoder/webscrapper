import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Home';
import CompanyDetails from './CompanyDetails';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:id" element={<CompanyDetails />} />
      </Routes>
    </div>
  );
}

export default App;
