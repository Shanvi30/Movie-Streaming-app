import React from "react";
import "./Footer.css";
import youtube_icon from "../../assets/youtube_icon.png";
import twitter_icon from "../../assets/twitter_icon.png";
import instagram_icon from "../../assets/instagram_icon.png";
import facebook_icon from "../../assets/facebook_icon.png";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-logo" onClick={scrollToTop}>
            NET<span>FLIX</span>
          </div>
          <div className="footer-socials">
            <a href="#" className="social-icon" aria-label="Facebook">
              <img src={facebook_icon} alt="Facebook" />
            </a>
            <a href="#" className="social-icon" aria-label="Instagram">
              <img src={instagram_icon} alt="Instagram" />
            </a>
            <a href="#" className="social-icon" aria-label="Twitter">
              <img src={twitter_icon} alt="Twitter" />
            </a>
            <a href="#" className="social-icon" aria-label="YouTube">
              <img src={youtube_icon} alt="YouTube" />
            </a>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-links">
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li>About Us</li>
              <li>Careers</li>
              <li>Media Centre</li>
              <li>Investor Relations</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li>Help Centre</li>
              <li>Contact Us</li>
              <li>Gift Cards</li>
              <li>Audio Description</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li>Terms of Use</li>
              <li>Privacy Policy</li>
              <li>Legal Notices</li>
              <li>Cookie Preferences</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              <li>Movies</li>
              <li>TV Shows</li>
              <li>New & Popular</li>
              <li>My Watchlist</li>
            </ul>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <p className="copyright-text">© 1997-2025 Netflix, Inc.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
