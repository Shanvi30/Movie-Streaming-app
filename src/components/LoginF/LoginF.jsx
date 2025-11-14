import React from "react";
import "./LoginF.css";

const LoginF = () => {
  return (
    <footer>
      <div className="footer-top">
        Questions? Call{" "}
        <a href="tel:000-800-919-1743">000-800-919-1743</a>
      </div>

      <div className="footer-links">
        <ul>
          <li><a href="#">FAQ</a></li>
          <li><a href="#">Investor Relations</a></li>
          <li><a href="#">Privacy</a></li>
          <li><a href="#">Speed Test</a></li>
        </ul>
        <ul>
          <li><a href="#">Help Centre</a></li>
          <li><a href="#">Jobs</a></li>
          <li><a href="#">Cookie Preferences</a></li>
          <li><a href="#">Legal Notices</a></li>
        </ul>
        <ul>
          <li><a href="#">Account</a></li>
          <li><a href="#">Ways to Watch</a></li>
          <li><a href="#">Corporate Information</a></li>
          <li><a href="#">Only on Netflix</a></li>
        </ul>
        <ul>
          <li><a href="#">Media Centre</a></li>
          <li><a href="#">Terms of Use</a></li>
          <li><a href="#">Contact Us</a></li>
        </ul>
      </div>

      <div className="footer-lang">
        🌐 English
      </div>

      <div className="footer-bottom">Netflix India</div>
      <div className="footer-bottom small-text">
        This page is protected by Google reCAPTCHA to ensure you're not a bot.{" "}
        <a href="#">Learn more.</a>
      </div>
    </footer>
  );
};

export default LoginF;
