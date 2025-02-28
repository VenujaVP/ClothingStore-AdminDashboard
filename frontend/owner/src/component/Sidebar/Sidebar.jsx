// component/Sidebar/Sidebar.jsx

/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */

import React, { useState } from 'react';
import './Sidebar.css';
import logo from '../../assets/logo.png';
import {
  FaHome,
  FaChartLine,
  FaUsers,
  FaFolder,
  FaCog,
  FaEnvelope,
} from 'react-icons/fa';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { icon: <FaHome />, title: 'Home' },
    { icon: <FaChartLine />, title: 'Dashboard' },
    { icon: <FaUsers />, title: 'Users' },
    { icon: <FaFolder />, title: 'Projects' },
    { icon: <FaCog />, title: 'Settings' },
    { icon: <FaEnvelope />, title: 'Messages' },
  ];

  return (
    <div
      className={`sidebar ${isExpanded ? 'expanded' : ''}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <div className="menu-items">
        {menuItems.map((item, index) => (
          <div className="menu-item" key={index}>
            <span className="icon">{item.icon}</span>
            <span className="title">{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;