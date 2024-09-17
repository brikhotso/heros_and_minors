import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import DonationForm from './components/DonationForm';
import DonationList from './components/DonationList';
import WishlistForm from './components/WishlistForm';
import WishlistList from './components/WishlistList';
import HiddenObjectGame from './components/HiddenObjectGame';
import MazeGame from './components/MazeGame';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
	<Route path="/" element={<LandingPage />} />
	<Route path="/home" element={<Dashboard/>} />
	<Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
	<Route path="/dashboard" element={<Dashboard/>}>  
          <Route path="donationform" element={<DonationForm />} />
	  <Route path="donationlist" element={<DonationList />} />
	  <Route path="wishlistlist" element={<WishlistList />} />
	  <Route path="wishlistform" element={<WishlistForm />} />
	  <Route path="mazegame" element={<MazeGame />} />
	  <Route path="hiddenobjectgame" element={<HiddenObjectGame />} />
	</Route>
      </Routes>
    </Router>
  );
}

export default App;
