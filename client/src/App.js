import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './components/Auth';
import Wishlist from './components/Wishlist';
import Donations from './components/Donations';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/donations" element={<Donations />} />
      </Routes>
    </Router>
  );
}

export default App;
