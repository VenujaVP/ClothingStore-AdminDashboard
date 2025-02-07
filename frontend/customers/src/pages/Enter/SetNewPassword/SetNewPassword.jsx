/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

//pages/Enter/SetNewPassword/SetNewPassword.jsx

import React, { useState, useEffect } from 'react';
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import './SetNewPassword.css';

const SetNewPassword = () => {
  const { resetToken } = useParams(); // Extract token from URL
  console.log(resetToken)

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirm: false,
  });

  const [validations, setValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    match: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    validatePassword(formData.password);
  }, [formData.password]);

  useEffect(() => {
    setValidations(prev => ({
      ...prev,
      match: formData.password === formData.confirmPassword && formData.password !== ''
    }));
  }, [formData.password, formData.confirmPassword]);

  const validatePassword = (password) => {
    setValidations({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      match: password === formData.confirmPassword && password !== ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(validations).every(v => v)) {
      setIsSubmitting(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setResetSuccess(true);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const ValidationIcon = ({ isValid }) => (
    <span className={`validation-icon ${isValid ? 'valid' : 'invalid'}`}>
      {isValid ? <FaCheckCircle /> : <FaTimesCircle />}
    </span>
  );

  if (resetSuccess) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-image-section">
            <div className="image-wrapper">
              <h1>Password Reset Successful!</h1>
              <p>Your password has been successfully updated.</p>
            </div>
          </div>
          <div className="login-form-section">
            <div className="form-wrapper success-wrapper">
              <div className="success-icon">✓</div>
              <h2>All Done!</h2>
              <p>Your password has been reset successfully. You can now log in with your new password.</p>
              <button 
                className="login-btn"
                onClick={() => window.location.href = '/login'}
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-image-section">
          <div className="image-wrapper">
            <h1>Reset Password</h1>
            <p>Create a strong password for your account</p>
          </div>
        </div>

        <div className="login-form-section">
          <div className="form-wrapper">
            <h2>Create New Password</h2>
            <p className="text-muted">
              Please create a secure password that meets all the requirements below.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <span className="input-icon">
                  <FaLock />
                </span>
                <input
                  type={showPassword.password ? "text" : "password"}
                  name="password"
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility('password')}
                >
                  {showPassword.password ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="input-group">
                <span className="input-icon">
                  <FaLock />
                </span>
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="password-validations">
                <div className={`validation-item ${validations.length ? 'valid' : ''}`}>
                  <ValidationIcon isValid={validations.length} />
                  <span>At least 8 characters</span>
                </div>
                <div className={`validation-item ${validations.uppercase ? 'valid' : ''}`}>
                  <ValidationIcon isValid={validations.uppercase} />
                  <span>One uppercase letter</span>
                </div>
                <div className={`validation-item ${validations.lowercase ? 'valid' : ''}`}>
                  <ValidationIcon isValid={validations.lowercase} />
                  <span>One lowercase letter</span>
                </div>
                <div className={`validation-item ${validations.number ? 'valid' : ''}`}>
                  <ValidationIcon isValid={validations.number} />
                  <span>One number</span>
                </div>
                <div className={`validation-item ${validations.special ? 'valid' : ''}`}>
                  <ValidationIcon isValid={validations.special} />
                  <span>One special character</span>
                </div>
                <div className={`validation-item ${validations.match ? 'valid' : ''}`}>
                  <ValidationIcon isValid={validations.match} />
                  <span>Passwords match</span>
                </div>
              </div>

              <button 
                type="submit" 
                className={`login-btn ${isSubmitting ? 'loading' : ''}`}
                disabled={!Object.values(validations).every(v => v) || isSubmitting}
              >
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </button>

              <div className="signup-link">
                Remember your password? <a href="/login">Back to Login</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetNewPassword;