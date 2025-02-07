/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

// pages/Enter/ForgotPassword/ForgotPassword.jsx

import React, { useState } from 'react';
import { FaEnvelope, FaRedo, FaArrowLeft } from 'react-icons/fa';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8081/forgot-password/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      console.log(response);

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert('Email not found');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = () => {
    setIsSubmitted(false);
  };

  const handleBackToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-image-section">
          <div className="image-wrapper">
            {!isSubmitted ? (
              <>
                <h1 style={{ color: 'black' }}>Forgot Password?</h1>
                <p style={{ color: 'black' }}>Don&apos;t worry! It happens. Please enter the email associated with your account.</p>
              </>
            ) : (
              <>
                <h1 style={{ color: 'black' }}>Check Your Email</h1>
                <p style={{ color: 'black' }}>We&apos;ve sent you instructions to reset your password</p>
              </>
            )}
          </div>
        </div>

        <div className="login-form-section">
          <div className="form-wrapper">
            {!isSubmitted ? (
              <>
                <h2>Password Recovery</h2>
                <p className="text-muted">
                  Enter your email and we&apos;ll send you instructions to reset your password.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="input-group">
                    <span className="input-icon">
                      <FaEnvelope />
                    </span>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className={`login-btn ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>

                  <div className="signup-link">
                    Remember your password? <a href="/login">Back to Login</a>
                  </div>
                </form>
              </>
            ) : (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h2 style={{ color: 'black' }}>Check Your Inbox</h2>
                <div className="email-message">
                  <p className="primary-text" style={{ color: 'black' }}>
                    We sent a password reset link to:
                  </p>
                  <p className="email-address" style={{ color: '#23b893' }}>
                    {email}
                  </p>
                  <p className="secondary-text" style={{ color: 'black' }}>
                    Click the link in the email to reset your password.
                    If you don&apos;t see the email, check your spam folder.
                  </p>
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
                    Didn&apos;t receive the email? Check your spam filter, or
                  </p>
                  <a href="/support" className="support-link">
                    Contact Support
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;