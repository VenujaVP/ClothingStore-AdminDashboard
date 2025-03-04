/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */

// npm install react react-dom @react-oauth/google react-icons react-router-dom

import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import Sidebar from './component/Sidebar/Sidebar';
import Navbar from './component/Navbar/Navbar';

// Import pages
import AddEmployee from './Pages/Employee/AddEmployee';
// Import other pages as needed
// import EmployeeList from './Pages/Employee/EmployeeList';
// import Products from './Pages/Products/Products';
import AddProducts from './Pages/Products/AddProducts';
import ProductList from './Pages/Products/ProductList';
// import Home from './Pages/Home/Home';
// import Settings from './Pages/Settings/Settings';
// import Messages from './Pages/Messages/Messages';

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
      <div className="main-content">
        <Routes>
          {/* Default route */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* Main routes */}
          {/* <Route path="/home" element={<Home />} /> */}

          {/* Employee routes */}
          <Route path="/employees/add" element={<AddEmployee />} />
          {/* <Route path="/employees/list" element={<EmployeeList />} /> */}

          {/* Product routes */}
          {/* <Route path="/products" element={<Products />} /> */}
          <Route path="/products/add" element={<AddProducts />} />
          <Route path="/products/list" element={<ProductList />} />

          {/* Other routes */}
          {/* <Route path="/settings" element={<Settings />} />
          <Route path="/messages" element={<Messages />} /> */}

          {/* 404 route */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;