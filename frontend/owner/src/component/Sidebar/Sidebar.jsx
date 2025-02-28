/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */

import React, { useState } from 'react';
import './Sidebar.css';
import logo from './logo.png'; // Replace with your logo path

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { icon: "🏠", title: "Home" },
    { icon: "📊", title: "Dashboard" },
    { icon: "👥", title: "Users" },
    { icon: "📁", title: "Projects" },
    { icon: "⚙️", title: "Settings" },
    { icon: "📫", title: "Messages" },
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