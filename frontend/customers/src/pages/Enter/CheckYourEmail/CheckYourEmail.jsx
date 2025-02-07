/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

//pages/Enter/CheckYourEmail/CheckYourEmail.jsx

import React from 'react';
import { FaEnvelope, FaRedo, FaArrowLeft } from 'react-icons/fa';
import './CheckYourEmail.css';

const CheckYourEmail = () => {
  // You would typically get this from your app's state or URL parameters
  const userEmail = "user@example.com";

  const handleResendEmail = () => {
    // Add your resend email logic here
    console.log("Resending email...");
  };

  const handleBackToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-image-section">
          <div className="image-wrapper">
            <h1 style={{ color: 'black' }}>Check Your Email</h1> {/* Changed to black */}
            <p style={{ color: 'black' }}>We've sent you instructions to reset your password</p> {/* Changed to black */}
          </div>
        </div>

        <div className="login-form-section">
          <div className="form-wrapper email-check-wrapper">
            <div className="email-icon-wrapper">
              <FaEnvelope />
            </div>

            <div className="email-check-content">
              <h2 style={{ color: 'black' }}>Check Your Inbox</h2> {/* Changed to black */}
              <div className="email-message">
                <p className="primary-text" style={{ color: 'black' }}>
                  We sent a password reset link to:
                </p> {/* Changed to black */}
                <p className="email-address" style={{ color: '#23b893' }}>
                  {userEmail}
                </p>
                <p className="secondary-text" style={{ color: 'black' }}>
                  Click the link in the email to reset your password. 
                  If you don't see the email, check your spam folder.
                </p> {/* Changed to black */}
              </div>

              <div className="action-buttons">
                <button 
                  className="resend-btn"
                  onClick={handleResendEmail}
                >
                  <FaRedo className="button-icon" />
                  Resend Email
                </button>

                <button 
                  className="back-to-login"
                  onClick={handleBackToLogin}
                >
                  <FaArrowLeft className="button-icon" />
                  Back to Login
                </button>
              </div>

              <div className="help-text">
                <p style={{ color: 'black' }}>
                  Didn't receive the email? Check your spam filter, or
                </p> {/* Changed to black */}
                <a href="/support" className="support-link">
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckYourEmail;
