/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import {
  RiSearchLine,
  RiHeartLine,
  RiNotificationLine,
  RiShoppingCartLine,
  RiUserLine,
  RiMenuLine,
  RiHomeLine,
  RiArrowDownSLine,
} from 'react-icons/ri';
import './Navbar.css';

const Navbar = () => {
  const [notice, setNotice] = useState('Welcome to our website!');
  const [activeDropdown, setActiveDropdown] = useState(null); // Track active dropdown

  useEffect(() => {
    const notices = [
      'Welcome to our website!',
      'Check out our latest updates!',
      "Don't miss our special offers!",
      'Follow us on social media!',
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
      {/* Notice Bar */}
      <div className="notice-bar">
        <span>{notice}</span>
      </div>

      {/* Web View */}
      <div className="navbar-web">
        {/* First Row */}
        <div className="navbar-web-row1">
          <div className="logo">
            <img src="LOGO.jpeg" alt="Logo" className="logo-image" />
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Search for products..." />
            <button>
              <RiSearchLine />
            </button>
          </div>
          <div className="icons">
            <div className="icon-item">
              <RiHeartLine />
              <span>Wishlist</span>
            </div>
            <div className="icon-item">
              <RiNotificationLine />
              <span>Notification</span>
            </div>
            <div className="icon-item">
              <RiShoppingCartLine />
              <span>Cart</span>
            </div>
            <div className="icon-item">
              <RiUserLine />
              <span>Account</span>
            </div>
          </div>
        </div>

        {/* Second Row - Categories */}
        <div className="navbar-web-row2">
          <div className="categories">
            <div className="category">HOME</div>
            <div
              className="category"
              onMouseEnter={() => toggleDropdown('WOMEN')}
              onMouseLeave={() => toggleDropdown(null)}
            >
              WOMEN <RiArrowDownSLine className="dropdown-arrow" />
              {activeDropdown === 'WOMEN' && (
                <div className="dropdown">
                  <div className="dropdown-item">New Arrivals</div>
                  <div className="dropdown-item">
                    Tops & Tees <RiArrowDownSLine className="dropdown-arrow" />
                    <div className="sub-dropdown">
                      <div className="sub-dropdown-item">Blouses</div>
                      <div className="sub-dropdown-item">Crop Tops</div>
                      <div className="sub-dropdown-item">T-Shirts</div>
                      <div className="sub-dropdown-item">Hoodies & Sweaters</div>
                    </div>
                  </div>
                  <div className="dropdown-item">
                    Dresses & Bottoms <RiArrowDownSLine className="dropdown-arrow" />
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
                    Special Categories <RiArrowDownSLine className="dropdown-arrow" />
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
            <div
              className="category"
              onMouseEnter={() => toggleDropdown('MEN')}
              onMouseLeave={() => toggleDropdown(null)}
            >
              MEN <RiArrowDownSLine className="dropdown-arrow" />
              {activeDropdown === 'MEN' && (
                <div className="dropdown">
                  <div className="dropdown-item">New Arrivals</div>
                  <div className="dropdown-item">
                    Tops <RiArrowDownSLine className="dropdown-arrow" />
                    <div className="sub-dropdown">
                      <div className="sub-dropdown-item">Shirts</div>
                      <div className="sub-dropdown-item">T-Shirts</div>
                      <div className="sub-dropdown-item">Hoodies & Sweaters</div>
                    </div>
                  </div>
                  <div className="dropdown-item">
                    Bottoms <RiArrowDownSLine className="dropdown-arrow" />
                    <div className="sub-dropdown">
                      <div className="sub-dropdown-item">Trousers</div>
                      <div className="sub-dropdown-item">Denims</div>
                      <div className="sub-dropdown-item">Shorts</div>
                      <div className="sub-dropdown-item">Pants</div>
                    </div>
                  </div>
                  <div className="dropdown-item">
                    Special Categories <RiArrowDownSLine className="dropdown-arrow" />
                    <div className="sub-dropdown">
                      <div className="sub-dropdown-item">Office Wear</div>
                      <div className="sub-dropdown-item">Gym Wear</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="category">KIDS & BABY</div>
            <div className="category">WATCHES</div>
            <div className="category">FOOTWEAR</div>
            <div className="category">BAGS & WALLETS</div>
            <div className="category">ACCESSORIES</div>
            <div className="category">SALE & OFFERS</div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="navbar-mobile">
        {/* First Row */}
        <div className="navbar-mobile-row1">
          <div className="menu-icon">
            <RiMenuLine />
          </div>
          <div className="logo">
            <img src="LOGO.jpeg" alt="Logo" className="logo-image" />
          </div>
          <div className="notification-icon">
            <RiNotificationLine />
          </div>
        </div>

        {/* Second Row - Search Bar */}
        <div className="navbar-mobile-row2">
          <div className="search-bar">
            <input type="text" placeholder="Search for products..." />
            <button>
              <RiSearchLine />
            </button>
          </div>
        </div>

        {/* Bottom Navigation Bar */}
        <div className="navbar-mobile-bottom">
          <div className="bottom-icon">
            <RiHomeLine />
            <span>Home</span>
          </div>
          <div className="bottom-icon">
            <RiHeartLine />
            <span>Wishlist</span>
          </div>
          <div className="bottom-icon">
            <RiShoppingCartLine />
            <span>Cart</span>
          </div>
          <div className="bottom-icon">
            <RiUserLine />
            <span>Account</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;