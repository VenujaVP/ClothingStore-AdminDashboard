/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

//npm install react-icons react-router-dom axios yup 
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

// import ShoppingCart from './pages/shoppingcart/ShoppingCart';
import AuthenticatedShoppingCart from './pages/shoppingcart/ShoppingCart';
import AuthenticatedDashboard from './pages/Dashboard/Dashboard';
import AuthenticatedAccount from './pages/USER/account/Account';
import AuthenticatedShippingAddress from './pages/USER/shippingaddress/ShippingAddress';
import AuthenticatedShippingAddressForm from './pages/USER/shippingaddressform/ShippingAddressForm '
import AuthenticatedPaymentCardWindow from './pages/USER/paymentcardwindow/PaymentCardWindow';

function App() {
  const location = useLocation();

  const shouldDisplaySidebar = () => {
    const excludedPaths = ['/login', '/register', '/forgotpassword', '/passwordresetfinish', '/checkyouremail'];
    return !excludedPaths.includes(location.pathname) && !location.pathname.startsWith('/reset-password');
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

            <Route path="/dashboard" element={<AuthenticatedDashboard />} />
            <Route path="/shoppingcart" element={<AuthenticatedShoppingCart />} />
            <Route path="/account" element={<AuthenticatedAccount />} />
            <Route path="/shippingaddress" element={<AuthenticatedShippingAddress />} />
            <Route path="/shippingaddressform" element={<AuthenticatedShippingAddressForm/>} />
            <Route path="/paymentcardwindow" element={<AuthenticatedPaymentCardWindow/>} />
          </Routes>
        </main>
      </div>
    </>
  );
}



export default App
