import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import styles from './Dashboard.module.css';
import { FaHome, FaPuzzlePiece, FaSearch, FaGift } from 'react-icons/fa'; // Add fun icons

function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const userName = "User";

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    // Redirect to login or landing page
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <h1>Heroes & Minors</h1>
        </div>
        <div className={styles.auth}>
          {isLoggedIn ? (
            <div className={styles.userInfo}>
              <img
                src="https://via.placeholder.com/40"
                alt="Avatar"
                className={styles.avatar}
              />
              <span>{userName}</span>
              <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
            </div>
          ) : (
            <Link to="/login" className={styles.loginBtn}>Login</Link>
          )}
        </div>
      </header>

      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <ul>
            <li><Link to="/dashboard/mazegame"><FaPuzzlePiece /> Maze Game</Link></li>
            <li><Link to="/dashboard/hiddenobjectgame"><FaSearch /> Hidden Object Game</Link></li>
            <li><Link to="/dashboard/wishlistlist"><FaGift /> Wishlist</Link></li>
            <li><Link to="/dashboard/donationlist"><FaHome /> Donations</Link></li>
          </ul>
        </aside>

        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
