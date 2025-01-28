/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

//npm install react-icons react-router-dom axios yup
//npm install @mui/material @emotion/react @emotion/styled
//npm install @react-oauth/google@latest

import { Route, Routes, useLocation } from 'react-router-dom';
import { useState } from 'react'
import './App.css'
import Navbar from './conponent/navbar/navbar'

import Login from './pages/Enter/Login/Login'
import Register from './pages/Enter/Register/Register'
import Landing from './pages/Landing/Landing'
import SetNewPassword from './pages/Enter/SetNewPassword/SetNewPassword';
import ForgotPassword from './pages/Enter/ForgotPassword/ForgotPassword';
import PasswordResetFinish from './pages/Enter/PasswordReset/PasswordResetFinish';
import CheckYourEmail from './pages/Enter/CheckYourEmail/CheckYourEmail';
import ShoppingCart from './pages/shoppingcart/ShoppingCart';
import Account from './pages/account/Account';

import Dashboard from './pages/Dashboard/Dashboard';

function App() {
  const location = useLocation();

  const shouldDisplaySidebar = () => {
    return !['/login', '/register','/setnewpassword','/forgotpassword','/passwordresetfinish', '/checkyouremail'].includes(location.pathname);
  };

  return (
    <>
      <div className="content-wrapper">
        {shouldDisplaySidebar() && <Navbar />}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/setnewpassword" element={<SetNewPassword />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/passwordresetfinish" element={<PasswordResetFinish />} />
            <Route path="/checkyouremail" element={<CheckYourEmail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/shoppingcart" element={<ShoppingCart />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </main>
      </div>
    </>
  );
}



export default App
