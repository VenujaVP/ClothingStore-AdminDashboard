/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */

// npm install react react-dom @react-oauth/google react-icons react-router-dom axios yup @mui/material @emotion/react @emotion/styled

import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css'
import Sidebar from './component/Sidebar/Sidebar';
import Navbar from './component/Navbar/Navbar';

import Login from './Pages/Enter/Login/Login';
import Register from './pages/Enter/Register/Register';
import SetNewPassword from './pages/Enter/SetNewPassword/SetNewPassword';
import ForgotPassword from './Pages/Enter/ForgotPassword/ForgotPassword';
import PasswordResetFinish from './pages/Enter/PasswordReset/PasswordResetFinish';

// Import pages
import AddEmployee from './Pages/Employee/AddEmployee';
import AuthenticatedAddProducts from './Pages/Products/AddProducts';
import ProductList from './Pages/Products/ProductList';
import AuthenticatedAddExpenses from './Pages/Expenses/AddExpenses'


const App = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const shouldDisplaySidebar = () => {
    const excludedPaths = ['/owner-login', '/owner-register', '/owner-forgot-password', '/owner-password-reset-finish', '/owner-check-your-email'];
    return !excludedPaths.includes(location.pathname) && !location.pathname.startsWith('/owner-reset-password');
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
          <Route path="/owner-login" element={<Login />} />
          <Route path="/owner-register" element={<Register />} />
          <Route path="/owner-forgot-password" element={<ForgotPassword />} />
          <Route path="/owner-reset-password/:resetToken" element={<SetNewPassword />} />
          <Route path="/owner-password-reset-finish" element={<PasswordResetFinish />} />
          
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/employees/add" element={<AddEmployee />} />
          <Route path="/products/add" element={<AuthenticatedAddProducts />} />
          <Route path="/products/list" element={<ProductList />} />
          <Route path="/expenses/add" element={<AuthenticatedAddExpenses />} />
          <Route path="/expenses/hist" element={<AuthenticatedAddExpenses />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;