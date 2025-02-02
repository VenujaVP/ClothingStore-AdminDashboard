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
  RiCloseLine,
} from 'react-icons/ri';
import './Navbar.css';

const Navbar = () => {
  const [notice, setNotice] = useState('Welcome to our website!');
  const [activeDropdown, setActiveDropdown] = useState(null); // Track active dropdown
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Track mobile menu state

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

  // Function to toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div
              className="category"
              onMouseEnter={() => toggleDropdown('WATCHES')}
              onMouseLeave={() => toggleDropdown(null)}
            >
              WATCHES <RiArrowDownSLine className="dropdown-arrow" />
              {activeDropdown === 'WATCHES' && (
                <div className="dropdown">
                  <div className="dropdown-item">Men&apos;s Watches</div>
                  <div className="dropdown-item">Women&apos;s Watches</div>
                </div>

              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="navbar-mobile">
        {/* First Row */}
        <div className="navbar-mobile-row1">
          <div className="menu-icon" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <RiCloseLine /> : <RiMenuLine />}
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

        {/* Mobile Menu - Categories */}
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-category">HOME</div>
            <div className="mobile-category">
              WOMEN
              <div className="mobile-subcategory">New Arrivals</div>
              <div className="mobile-subcategory">
                Tops & Tees
                <div className="mobile-subcategory-item">Blouses</div>
                <div className="mobile-subcategory-item">Crop Tops</div>
                <div className="mobile-subcategory-item">T-Shirts</div>
                <div className="mobile-subcategory-item">Hoodies & Sweaters</div>
              </div>
              <div className="mobile-subcategory">
                Dresses & Bottoms
                <div className="mobile-subcategory-item">Dresses & Frocks</div>
                <div className="mobile-subcategory-item">Skirts</div>
                <div className="mobile-subcategory-item">Trousers</div>
                <div className="mobile-subcategory-item">Denims</div>
                <div className="mobile-subcategory-item">Shorts</div>
                <div className="mobile-subcategory-item">Pants</div>
              </div>
              <div className="mobile-subcategory">
                Special Categories
                <div className="mobile-subcategory-item">Jumpsuits</div>
                <div className="mobile-subcategory-item">Bodysuits</div>
                <div className="mobile-subcategory-item">Office Wear</div>
                <div className="mobile-subcategory-item">Gym Wear</div>
                <div className="mobile-subcategory-item">Night & Loungewear</div>
              </div>
            </div>
            <div className="mobile-category">
              WATCHES
              <div className="mobile-subcategory">Men&apos;s Watches</div>
              <div className="mobile-subcategory">Women&apos;s Watches</div>
              <div className="mobile-subcategory">Kids&apos; Watches</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;