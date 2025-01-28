/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

// import React from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';


const Dashboard = () => {
  const[auth, setAuth] = useState(false)
  const[massage, setMassage]  = useState("")
  const[name, setName]  = useState("")
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  axios.defaults.withCredentials = true

  useEffect(() =>{
      axios.get('http://localhost:8081/dashboard', { withCredentials: true })
        .then(res =>{
          if(res.data.Status === "Success"){
            setAuth(true)
            setName(res.data.name)
          }else{
            setAuth(false)
            setMassage(res.data.err)
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Error during authentication:", err);
        });

  },[])

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
      axios.get('http://localhost:8081/logout')
        .then(res => {
          console.log(res);
          setAuth(false);
          setName("");
          setMassage("Logged out successfully");
          navigate('/login');
        })
        .catch(err => console.log(err));
  };
  

  return (
    <div className="home">
      {auth?
        <div>
          <h1>Welcome to the Home Page!</h1>
          <p>{name} are successfully logged in.</p>
          <button onClick={handleLogout}>LogOut</button>

        </div>
      :
        <div className="login-now-container">
          <div className="login-now-section">
            <h3 className="login-title">Login Expired</h3>
            <p className="login-subtitle">Your login has expired. Please log in again to continue.</p>
            <button className="login-button" onClick={() => navigate('/login')}>Log In Now</button>
          </div>
        </div>
      };
    </div>
  );
};

export default Dashboard;
