/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

//pages/Enter/ForgotPassword/ForgotPassword.jsx

import React, { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    try {
      // Add your password reset email logic here
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-image-section">
          <div className="image-wrapper">
            <h1>Forgot Password?</h1>
            <p>Don&apos;t worry! It happens. Please enter the email associated with your account.</p>
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
                <h2>Check Your Email</h2>
                <p>
                  We have sent a password recovery link to your email address: <strong>{email}</strong>
                </p>
                <p className="text-muted">
                  Please check your inbox and click on the link to reset your password. 
                  If you don&apos;t see the email, please check your spam folder.
                </p>
                <button 
                  className="login-btn"
                  onClick={() => window.location.href = '/login'}
                >
                  Return to Login
                </button>
                <div className="resend-link">
                  Didnt receive the email? <a href="#" onClick={(e) => {
                    e.preventDefault();
                    setIsSubmitted(false);
                  }}>Try again</a>
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