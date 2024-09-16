import React, { useState } from 'react';
import './LandingPage.css'; // Isolated styles for the landing page

const LandingPage = () => {
  const [showModal, setShowModal] = useState(false);

  const handleGetStartedClick = () => {
    setShowModal(true); // Show modal when "Get Started" is clicked
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close modal when "X" or background is clicked
  };

  return (
    <div className="landing-container">
      {/* Header */}
      <header className="landing-header">
        <div className="logo">Heros & Minors</div>
        <nav>
          <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#testimonials">Testimonials</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <h1>Welcome to Heros & Minors</h1>
        <p>Your one-stop platform for kids fun, wishes, and donations</p>
        <div className="hero-buttons">
          <button className="get-started" onClick={handleGetStartedClick}>Get Started</button>
          <a href="#about" className="learn-more">Learn More</a>
        </div>
      </section>

      {/* Pop-up Modal for Get Started */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={handleCloseModal}>&times;</span>
            <h2>Choose an Option</h2>
            <div className="modal-options">
              <a href="/login" className="option-button">Login</a>
              <a href="/register" className="option-button">Sign Up</a>
              <button className="option-button" onClick={() => alert('Continue Offline')}>Continue Offline</button>
            </div>
          </div>
        </div>
      )}

      {/* About Section */}
      <section id="about" className="about-section">
        <h2>About Us</h2>
        <p>Our mission is to bring joy to kids through fun games, wishes, and a unique donation platform.</p>
        <p><strong>Vision:</strong> A world where every kid’s wish can come true.</p>
        <p><strong>Team:</strong> We are a group of passionate developers, designers, and educators.</p>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <h2>Features</h2>
        <div className="features-list">
          <div>Maze Game</div>
          <div>Hidden Object Game</div>
          <div>Wishlist</div>
          <div>Donations</div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <h2>Testimonials</h2>
        <p>"A great platform for kids!" - Parent</p>
        <p>"My kids love the games and the wishlist feature." - Parent</p>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <h2>Contact Us</h2>
        <p>Email: info@herosandminors.com</p>
        <p>Phone: (123) 456-7890</p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 Heros & Minors. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
