/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [notice, setNotice] = useState('Welcome to our website!');
  const [activeDropdown, setActiveDropdown] = useState(null); // Track active dropdown

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

  // Function to handle dropdown toggle
  const toggleDropdown = (category) => {
    setActiveDropdown(activeDropdown === category ? null : category);
  };

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
          {/* HOME */}
          <div className="category">HOME</div>

          {/* WOMEN */}
          <div
            className="category"
            onMouseEnter={() => toggleDropdown('WOMEN')}
            onMouseLeave={() => toggleDropdown(null)}
          >
            WOMEN
            {activeDropdown === 'WOMEN' && (
              <div className="dropdown">
                <div className="dropdown-item">New Arrivals</div>
                <div className="dropdown-item">
                  Tops & Tees
                  <div className="sub-dropdown">
                    <div className="sub-dropdown-item">Blouses</div>
                    <div className="sub-dropdown-item">Crop Tops</div>
                    <div className="sub-dropdown-item">T-Shirts</div>
                    <div className="sub-dropdown-item">Hoodies & Sweaters</div>
                  </div>
                </div>
                <div className="dropdown-item">
                  Dresses & Bottoms
                  <div className="sub-dropdown">
                    <div className="sub-dropdown-item">Dresses & Frocks</div>
                    <div className="sub-dropdown-item">Skirts</div>
                    <div className="sub-dropdown-item">Trousers</div>
                    <div className="sub-dropdown-item">Denims</div>
                    <div className="sub-dropdown-item">Shorts</div>
                    <div className="sub-dropdown-item">Pants</div>
                  </div>
                </div>
                <div className="dropdown-item">
                  Special Categories
                  <div className="sub-dropdown">
                    <div className="sub-dropdown-item">Jumpsuits</div>
                    <div className="sub-dropdown-item">Bodysuits</div>
                    <div className="sub-dropdown-item">Office Wear</div>
                    <div className="sub-dropdown-item">Gym Wear</div>
                    <div className="sub-dropdown-item">Night & Loungewear</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* MEN */}
          <div
            className="category"
            onMouseEnter={() => toggleDropdown('MEN')}
            onMouseLeave={() => toggleDropdown(null)}
          >
            MEN
            {activeDropdown === 'MEN' && (
              <div className="dropdown">
                <div className="dropdown-item">New Arrivals</div>
                <div className="dropdown-item">
                  Tops
                  <div className="sub-dropdown">
                    <div className="sub-dropdown-item">Shirts</div>
                    <div className="sub-dropdown-item">T-Shirts</div>
                    <div className="sub-dropdown-item">Hoodies & Sweaters</div>
                  </div>
                </div>
                <div className="dropdown-item">
                  Bottoms
                  <div className="sub-dropdown">
                    <div className="sub-dropdown-item">Trousers</div>
                    <div className="sub-dropdown-item">Denims</div>
                    <div className="sub-dropdown-item">Shorts</div>
                    <div className="sub-dropdown-item">Pants</div>
                  </div>
                </div>
                <div className="dropdown-item">
                  Special Categories
                  <div className="sub-dropdown">
                    <div className="sub-dropdown-item">Office Wear</div>
                    <div className="sub-dropdown-item">Gym Wear</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* KIDS & BABY */}
          <div
            className="category"
            onMouseEnter={() => toggleDropdown('KIDS & BABY')}
            onMouseLeave={() => toggleDropdown(null)}
          >
            KIDS & BABY
            {activeDropdown === 'KIDS & BABY' && (
              <div className="dropdown">
                <div className="dropdown-item">New Arrivals</div>
                <div className="dropdown-item">Boys&apos; Clothing (3-16)</div>
                <div className="dropdown-item">Girls&apos; Clothing (3-16)</div>
                <div className="dropdown-item">Baby Clothing</div>
                <div className="dropdown-item">Footwear</div>
                <div className="dropdown-item">
                  Bags & Accessories
                  <div className="sub-dropdown">
                    <div className="sub-dropdown-item">Kids&apos; Bags</div>
                    <div className="sub-dropdown-item">Kids&apos; Watches</div>
                    <div className="sub-dropdown-item">Hats & Caps</div>
                  </div>
                </div>
                <div className="dropdown-item">Mother & Baby Care</div>
              </div>
            )}
          </div>

          {/* WATCHES */}
          <div className="category">WATCHES</div>

          {/* FOOTWEAR */}
          <div className="category">FOOTWEAR</div>

          {/* BAGS & WALLETS */}
          <div className="category">BAGS & WALLETS</div>

          {/* ACCESSORIES */}
          <div className="category">ACCESSORIES</div>

          {/* SALE & OFFERS */}
          <div className="category">SALE & OFFERS</div>
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