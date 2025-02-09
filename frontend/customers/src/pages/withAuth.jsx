/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './withAuth.css';  // Add your styles for the Login expired message

const withAuth = (WrappedComponent) => {
  return (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
      // Make a request to check the token on the server side
      axios.get('http://localhost:8081/tokenverification', { withCredentials: true })
        .then(res => {
          if (res.data.Status === "Success") {
            setIsAuthenticated(true);
            setName(res.data.name);  // Set name if token is valid
          } else {
            setIsAuthenticated(false);
            setMessage(res.data.err);  // Show error message if token is invalid
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Error during authentication:", err);
          setIsAuthenticated(false);
          setMessage("An error occurred during authentication. Please try again.");
          setLoading(false);
        });
    }, []);  // Empty array ensures this effect runs only once when component mounts

    if (loading) return <div className="loading-spinner">Loading...</div>;  // Use a spinner or skeleton screen

    if (!isAuthenticated) {
      return (
        <div className="login-now-container">
          <div className="login-now-section">
            <h3 className="login-title">Login Expired</h3>
            <p className="login-subtitle">{message || "Your login has expired. Please log in again to continue."}</p>
            <button className="login-button" onClick={() => navigate('/login')} aria-label="Log in now">
              Log In Now
            </button>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;