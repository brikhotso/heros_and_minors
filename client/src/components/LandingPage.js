import React, { useState } from 'react';
import './LandingPage.css'; // Isolated styles for the landing page
import { Link } from 'react-router-dom';
import Modal from './Modal';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const LandingPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const handleGetStartedClick = () => {
    setShowModal(true); // Show modal when "Get Started" is clicked
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close modal when "X" or background is clicked
    setModalContent(null); // Clear modal content
  };

  const handleLoginClick = () => {
    setModalContent(<LoginForm onClose={handleCloseModal} />);
    setShowModal(true);
  };

  const handleRegisterClick = () => {
    setModalContent(<RegisterForm onClose={handleCloseModal} />);
    setShowModal(true);
  };

  return (
    <div className="landing-container">
      {/* Header */}
      <header className="landing-header">
        <div className="logo">
	  <Link to="/">
            <img src="https://i.imgur.com/4MZUXRO.png" alt="Heroes & Minors Logo" />
          </Link>
	</div>
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
        <p>Small acts, big impact</p>
        <div className="hero-buttons">
          <button className="get-started" onClick={handleGetStartedClick}>Get Started</button>
          <a href="#about" className="learn-more">Learn More</a>
        </div>
      </section>

      {/* Pop-up Modal for Get Started */}
      {showModal && (
        <Modal isOpen={showModal} onClose={handleCloseModal}>
          {modalContent || (
            <div className="modal-options">
	      <h2>Choose an Option</h2>
	      <button className="option-button" onClick={handleLoginClick}>Login</button>
              <button className="option-button" onClick={handleRegisterClick}>Sign Up</button>
              <Link to="/dashboard" className="option-button">Continue Offline</Link>
            </div>
          )}
        </Modal>
      )}

      {/* About Section */}
      <section id="about" className="about-section">
        <h2>Welcome to Heros & Minors</h2>
        <p>
          As a mom and developer, I have always sought ways to combine my passions for family, kindness, and innovation. 
          Heros & Minors was born from a heartfelt desire to make a difference in childrens lives.
        </p>
        <h3>My Story</h3>
        <p>
          I will never forget the rainy day I saw a child walking to school without a jersey. It broke my heart, and I knew I had to act. 
          That small gesture of kindness sparked something deeper within me. As a mom, I want my son to grow up in a world where kindness and generosity thrive.
        </p>
        <h3>Meet the Founder</h3>
        <div className="team-section">
          <img src="/images/brenda.jpg" alt="Brenda Mabitsela" className="team-photo" />
          <p>Hi, I am Brenda, the founder of Heros & Minors. Driven by my love for family, kindness, and community, I built this platform with the help of my son to make a difference in kids lives.</p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <h2>Join Our Movement</h2>
        <div className="features-list">
          <div className="feature-item">
            <img src="/images/maze-game.jpg" alt="Maze Game" className="feature-image" />
            <h3><a href="/mazegame" >Maze Game</a></h3>
            <p>Engaging puzzle game for kids, developed with love and input from my son.</p>
          </div>
          <div className="feature-item">
            <img src="/images/hidden-object-game.jpg" alt="Hidden Object Game" className="feature-image" />
            <h3><a href="/hiddenobjectgame" >Hidden Object Game</a></h3>
            <p>Interactive game promoting cognitive development and fun.</p>
          </div>
          <div className="feature-item">
            <img src="/images/wishlist.jpg" alt="Wishlist" className="feature-image" />
            <h3><a href="/dashboard/wishlistlist" >Wishlist</a></h3>
            <p>A safe space for kids to share their wishes and connect with helpers.</p>
          </div>
          <div className="feature-item">
            <img src="/images/donation-platform.jpg" alt="Donation Platform" className="feature-image" />
            <h3><a href="/dashboard/donationlist" >Heros Platform</a></h3>
            <p>Donate gently used items or services to make a tangible difference in childrens lives.</p>
          </div>
        </div>
      </section>

      <section class="bubbles">
            <div class="bubble"></div>
            <div class="bubble"></div>
            <div class="bubble"></div>
            <div class="bubble"></div>
            <div class="bubble"></div>
            <div class="bubble"></div>
            <div class="bubble"></div>
            <div class="bubble"></div>
      </section>
	  
      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <h2>Real Stories, Real Impact</h2>
        <p>"A heartwarming platform that brings kindness to kids." - Parent</p>
        <p>"My child's smile is all thanks to Heros & Minors!" - Parent</p>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <h2>Get in Touch</h2>
        <div class="social-icons">
          <a href="https://github.com/brikhotso" target="_blank">
            <img src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" alt="GitHub" />
          </a>
          <a href="https://linkedin.com/in/brenda-rikhotso-a8747874" target="_blank">
            <img src="https://static.vecteezy.com/system/resources/previews/023/986/970/large_2x/linkedin-logo-linkedin-logo-transparent-linkedin-icon-transparent-free-free-png.png" alt="LinkedIn" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 Heros & Minors. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
