// component/Navber/Navbar.jsx

/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */

import React, { useState } from 'react';
import './Navbar.css';
import { FaBell, FaSearch, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div className="navbar">
      {/* Search Section */}
      <div className={`search-container ${searchFocused ? 'focused' : ''}`}>
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

      {/* Right Section */}
      <div className="nav-right">
        {/* Notifications */}
        <div className="nav-item">
          <div className="notification-icon">
            <FaBell />
            <span className="notification-badge">3</span>
          </div>
        </div>

        {/* User Profile */}
        <div className="nav-item user-profile">
          <span className="user-name">John Doe</span>
          <FaUserCircle className="user-avatar" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
