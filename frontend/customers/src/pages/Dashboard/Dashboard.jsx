/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import withAuth from '../withAuth'; // Import the HOC
import './Dashboard.css';

const Dashboard = ({ name }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    axios.get('http://localhost:8081/logout')
      .then(() => {
        navigate('/login');
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="home">
      <h1>Welcome to the Home Page!</h1>
      <p>{name} is successfully logged in.</p>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

// const AuthenticatedDashboard = withAuth(Dashboard);
// export default AuthenticatedDashboard;
export default Dashboard;
