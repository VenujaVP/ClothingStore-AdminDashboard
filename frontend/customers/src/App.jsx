/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

//npm install react-icons react-router-dom axios yup 
//npm install react-icons
//npm install @mui/material @emotion/react @emotion/styled
//npm install @react-oauth/google@latest

import { Route, Routes, useLocation } from 'react-router-dom';
import { useState } from 'react'
import './App.css'
import Navbar from './conponent/Navbar/Navbar';

import Login from './pages/Enter/Login/Login'
import Register from './pages/Enter/Register/Register'
import Landing from './pages/Landing/Landing'
import SetNewPassword from './pages/Enter/SetNewPassword/SetNewPassword';
import ForgotPassword from './pages/Enter/ForgotPassword/ForgotPassword';
import PasswordResetFinish from './pages/Enter/PasswordReset/PasswordResetFinish';

import ShoppingCart from './pages/shoppingcart/ShoppingCart';
import Dashboard from './pages/Dashboard/Dashboard';
import Account from './pages/USER/account/Account';
import ShippingAddress from './pages/USER/shippingaddress/ShippingAddress';
import ShippingAddressForm from './pages/USER/shippingaddressform/ShippingAddressForm '
import PaymentCardWindow from './pages/USER/paymentcardwindow/PaymentCardWindow';

function App() {
  const location = useLocation();

  const shouldDisplaySidebar = () => {
    return !['/login', '/register','/reset-password','/forgotpassword','/passwordresetfinish', '/checkyouremail'].includes(location.pathname);
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
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/reset-password/:resetToken" element={<SetNewPassword />} />
            <Route path="/passwordresetfinish" element={<PasswordResetFinish />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/shoppingcart" element={<ShoppingCart />} />
            <Route path="/account" element={<Account />} />
            <Route path="/shippingaddress" element={<ShippingAddress />} />
            <Route path="/shippingaddressform" element={<ShippingAddressForm/>} />
            <Route path="/paymentcardwindow" element={<PaymentCardWindow/>} />
          </Routes>
        </main>
      </div>
    </>
  );
}



export default App
