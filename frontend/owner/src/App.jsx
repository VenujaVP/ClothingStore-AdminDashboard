/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */

// npm install react react-dom @react-oauth/google react-icons react-router-dom  axios yup @mui/material @emotion/react @emotion/styled

import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css'
import Sidebar from './component/Sidebar/Sidebar';
import Navbar from './component/Navbar/Navbar';

import Login from './Pages/Enter/Login/Login';
import Register from './pages/Enter/Register/Register';
import SetNewPassword from './pages/Enter/SetNewPassword/SetNewPassword';
import ForgotPassword from './pages/Enter/ForgotPassword/ForgotPassword';
import PasswordResetFinish from './pages/Enter/PasswordReset/PasswordResetFinish';

// Import pages
import AddEmployee from './Pages/Employee/AddEmployee';
import AddProducts from './Pages/Products/AddProducts';
import ProductList from './Pages/Products/ProductList';


const App = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const shouldDisplaySidebar = () => {
    const excludedPaths = ['/login', '/register', '/forgotpassword', '/passwordresetfinish', '/checkyouremail'];
    return !excludedPaths.includes(location.pathname) && !location.pathname.startsWith('/reset-password');
  };

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
      {shouldDisplaySidebar() && (
        <>
          <Navbar 
            onMobileMenuClick={handleMobileMenuToggle}
            isMobile={isMobile}
            isMenuOpen={isMobileMenuOpen}
          />
          <Sidebar 
            isMobileMenuOpen={isMobileMenuOpen} 
            onMobileMenuClose={() => setIsMobileMenuOpen(false)} 
          />
        </>
      )}

      <div className={`main-content ${shouldDisplaySidebar() ? '' : 'full-screen'}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/reset-password/:resetToken" element={<SetNewPassword />} />
          <Route path="/passwordresetfinish" element={<PasswordResetFinish />} />
          
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/employees/add" element={<AddEmployee />} />
          <Route path="/products/add" element={<AddProducts />} />
          <Route path="/products/list" element={<ProductList />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;