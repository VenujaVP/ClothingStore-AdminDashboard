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
        })

        .then(err => {
          console.log(err);
        });
  },[])

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
          <div className="message-box">
            <p className="message-text">{massage}</p>
          </div>
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
