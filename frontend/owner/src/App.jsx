/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */

// npm install react react-dom @react-oauth/google react-icons

import React, { useState, useEffect } from 'react'
import './App.css'
import Sidebar from './component/Sidebar/Sidebar';
import Navbar from './component/Navbar/Navbar';

const App = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="app">
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        onMobileMenuClose={() => setIsMobileMenuOpen(false)} 
      />
      <Navbar 
        onMobileMenuClick={handleMobileMenuToggle}
        isMobile={isMobile}
        isMenuOpen={isMobileMenuOpen}
      />
    </div>
  )
}

export default App