// import React from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


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
        <div>
          <div>{massage}</div>
          <h3>Login Now</h3>
          <button onClick={() => navigate('/login')}>Login</button>
        </div>
        
      };
    </div>
  );
};

export default Dashboard;
