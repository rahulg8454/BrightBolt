import React from 'react';
import '../styles/componentstyle/footer.css';
import { FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <div className="footer">
      <div className="footer-content">
        <div className="footer-info">
          <p>© {new Date().getFullYear()} Quiz App. All rights reserved.</p>
        </div>
        <div className="footer-social">
          <a
            href="https://www.linkedin.com/in/rahul-gupta-077526277/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <FaLinkedin />
          </a>
        </div>
      </div>
    </div>
  );
}
