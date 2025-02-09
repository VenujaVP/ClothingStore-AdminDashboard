/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    // Make a request to check the token on the server side
    axios.get('http://localhost:8081/tokenverification', { withCredentials: true })
      .then(res => {
        if (res.data.Status === "Success") {
          setAuth(true);
          setName(res.data.name);  // Set name if token is valid
        } else {
          setAuth(false);
          setMessage(res.data.err);  // Show error message if token is invalid
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error during authentication:", err);
        setAuth(false);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    axios.get('http://localhost:8081/logout')
      .then(res => {
        setAuth(false);
        setName("");
        setMessage("Logged out successfully");
        navigate('/login');
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="home">
      {auth ? (
        <div>
          <h1>Welcome to the Home Page!</h1>
          <p>{name} is successfully logged in.</p>
          <button onClick={handleLogout}>LogOut</button>
        </div>
      ) : (
        <div className="login-now-container">
          <div className="login-now-section">
            <h3 className="login-title">Login Expired</h3>
            <p className="login-subtitle">Your login has expired. Please log in again to continue.</p>
            <button className="login-button" onClick={() => navigate('/login')}>Log In Now</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
