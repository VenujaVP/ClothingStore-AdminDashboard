// component/Sidebar/Sidebar.jsx

/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */

import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import logo from '../../assets/logo.png';
import {
  FaHome,
  FaChartLine,
  FaUsers,
  FaFolder,
  FaCog,
  FaEnvelope,
  FaTimes,
} from 'react-icons/fa';

const Sidebar = ({ isMobileMenuOpen, onMobileMenuClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { icon: <FaHome />, title: 'Home' },
    { icon: <FaChartLine />, title: 'Dashboard' },
    { icon: <FaUsers />, title: 'Users' },
    { icon: <FaFolder />, title: 'Projects' },
    { icon: <FaCog />, title: 'Settings' },
    { icon: <FaEnvelope />, title: 'Messages' },
  ];

  // Only show hover expand on desktop
  const handleMouseEnter = () => {
    if (!isMobile) setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    if (!isMobile) setIsExpanded(false);
  };

  return (
    <>
      {isMobile && (
        <div 
          className={`sidebar-overlay ${isMobileMenuOpen ? 'show' : ''}`}
          onClick={onMobileMenuClose}
        />
      )}
      <div
        className={`sidebar ${isExpanded ? 'expanded' : ''} ${
          isMobile ? 'mobile' : ''
        } ${isMobileMenuOpen ? 'mobile-open' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Mobile Close Button */}
        {isMobile && (
          <div className="mobile-close" onClick={onMobileMenuClose}>
            <FaTimes />
          </div>
        )}

        {/* Only show logo on desktop or when mobile menu is open */}
        {(!isMobile || isMobileMenuOpen) && (
          <div className="logo-container">
            {logo ? (
              <img src={logo} alt="Logo" className="logo" />
            ) : (
              <span style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#23b893'
              }}>
                LOGO
              </span>
            )}
          </div>
        )}

        <div className="menu-items">
          {menuItems.map((item, index) => (
            <div className="menu-item" key={index}>
              <span className="icon">{item.icon}</span>
              <span className="title">{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;