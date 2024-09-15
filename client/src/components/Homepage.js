import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Homepage.module.css';

function Homepage() {
  const continueOffline = () => {
    alert('Continuing offline...');
  };

  return (
    <div className={styles.homepage}>
      <div className={styles.container}>
        <div className={styles.authButtons}>
          <Link to="/auth" className={`${styles.button} ${styles.authButton}`}>Login</Link>
          <Link to="/auth" className={`${styles.button} ${styles.authButton}`}>Sign Up</Link>
          <button className={`${styles.button} ${styles.authButton}`} onClick={continueOffline}>Continue Offline</button>
        </div>

        <h1 className={styles.title}>Welcome to Heroes & Minors</h1>

        <div className={styles.gameButtons}>
          <Link to="/mazegame" className={`${styles.button} ${styles.featureButton}`}>Maze Game</Link>
          <Link to="/hiddenobjectgame" className={`${styles.button} ${styles.featureButton}`}>Hidden Object Game</Link>
          <Link to="/wishlist" className={`${styles.button} ${styles.featureButton}`}>Wish</Link>
          <Link to="/donations" className={`${styles.button} ${styles.featureButton}`}>Donations</Link>
        </div>

        <div className={styles.bubbles}>
          <div className={styles.bubble}></div>
          <div className={styles.bubble}></div>
          <div className={styles.bubble}></div>
          <div className={styles.bubble}></div>
          <div className={styles.bubble}></div>
          <div className={styles.bubble}></div>
          <div className={styles.bubble}></div>
          <div className={styles.bubble}></div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
