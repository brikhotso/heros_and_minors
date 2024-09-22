import axiosInstance from '../axiosConfig';
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import { FaHome, FaPuzzlePiece, FaSearch, FaGift } from 'react-icons/fa'; // Add fun icons

function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const offline = localStorage.getItem('offline');
  const navigate = useNavigate();
  const [isSidebarActive, setSidebarActive] = useState(false);

  useEffect(() => {
    if (token) {
      const fetchCurrentUser = async () => {
        try {
          const response = await axiosInstance.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserName(response.data.name);
          setIsLoggedIn(true);
        } catch (err) {
          setError('Error fetching current user');
        }
      };

      fetchCurrentUser();
    } else if (offline) {
      setIsLoggedIn(false);
    }
  }, [token, offline]);

  const toggleSidebar = () => {
    setSidebarActive(!isSidebarActive);
  };
    
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('offline');
    setIsLoggedIn(false);
    navigate('/'); // Redirect to home page
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Link to="/">
            <img src="https://i.imgur.com/4MZUXRO.png" alt="Heroes & Minors Logo" />
          </Link>
        </div>
        <div className={styles.auth}>
          {isLoggedIn ? (
            <div className={styles.userInfo}>
              <span role="img" aria-label="waving hand">👋</span> Welcome, {userName}!
              <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
            </div>
          ) : (
            <Link to="/login" className={styles.loginBtn}>Login</Link>
          )}
        </div>
      </header>

      <div className={styles.container}>
        <aside className={`${styles.sidebar} ${isSidebarActive ? styles.active : ''}`}>
          <ul>
            <li><Link to="/mazegame"><FaPuzzlePiece /> Maze Game</Link></li> {/* Direct link to maze game */}
            <li><Link to="/hiddenobjectgame"><FaSearch /> Hidden Object Game</Link></li>
            <li><Link to="/dashboard/wishlistlist"><FaGift /> Wishlist</Link></li>
            <li><Link to="/dashboard/donationlist"><FaHome /> Donations</Link></li>
          </ul>
        </aside>

        <main className={styles.mainContent}>
          <div className={styles.contentWrapper}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
