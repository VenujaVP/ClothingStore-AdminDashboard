// component/Navber/Navbar.jsx

/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */

import React, { useState } from 'react';
import './Navbar.css';
import { FaBell, FaSearch, FaUserCircle, FaBars } from 'react-icons/fa';
import logo from '../../assets/logo.png';

const Navbar = ({ onMobileMenuClick, isMobile, isMenuOpen }) => {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div className={`navbar ${isMenuOpen ? 'menu-open' : ''}`}>
      {/* Mobile Menu Button */}
      <div className="mobile-menu-btn" onClick={onMobileMenuClick}>
        <FaBars />
      </div>

      {/* Logo - Always show in center */}
      <div className="navbar-logo">
        {logo ? (
          <img src={logo} alt="Logo" className="nav-logo-img" />
        ) : (
          <span className="logo-text">LOGO</span>
        )}
      </div>

      {/* Search Section - Hide on mobile */}
      {!isMobile && (
        <div className={`search-container ${searchFocused ? 'focused' : ''}`}>
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>
      )}

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
          {!isMobile && <span className="user-name">John Doe</span>}
          <FaUserCircle className="user-avatar" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
