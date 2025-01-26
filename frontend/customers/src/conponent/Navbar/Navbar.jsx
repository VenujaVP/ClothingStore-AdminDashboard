/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [notice, setNotice] = useState('Welcome to our website!');

  useEffect(() => {
    const notices = [
      'Welcome to our website!',
      'Check out our latest updates!',
      "Don't miss our special offers!",
      'Follow us on social media!'
    ];

    let index = 0;
    const intervalId = setInterval(() => {
      index = (index + 1) % notices.length;
      setNotice(notices[index]);
    }, 3000); // Change notice every 3 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <>
      <div className="notice-bar">
        <span>{notice}</span>
      </div>

      <div className="navbarr">
        <div className="menu-icon">
          <i className="ri-menu-line" aria-hidden="true"></i>
        </div>

        <div className="logo">
          <img src="LOGO.jpeg" alt="Logo" className="logo-image" />
        </div>

        <div className="categories">
          <div className="category">abv</div>
          <div className="category">abc</div>
          <div className="category">abc</div>
          <div className="category">abc</div>
          <div className="category">abc</div>
          <div className="category">abc</div>
          <div className="category">abc</div>
        </div>

        <div className="icons">
          <span role="img" aria-label="search">
            <i className="ri-search-line"></i>
          </span>
          <span role="img" aria-label="cart">
            <i className="ri-shopping-cart-2-line"></i>
          </span>
          <span role="img" aria-label="person">
            <i className="ri-user-line"></i>
          </span>
        </div>
      </div>

      <div className="mobile-navbar">
        <span role="img" aria-label="home">
          <i className="ri-home-2-line"></i>
        </span>
        <span role="img" aria-label="search">
          <i className="ri-search-line"></i>
        </span>
        <span role="img" aria-label="cart">
          <i className="ri-shopping-cart-2-line"></i>
        </span>
        <span role="img" aria-label="person">
          <i className="ri-user-line"></i>
        </span>
      </div>
    </>
  );
};

export default Navbar;
