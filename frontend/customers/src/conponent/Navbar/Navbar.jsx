/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  RiSearchLine,
  RiHeartLine,
  RiNotificationLine,
  RiShoppingCartLine,
  RiUserLine,
  RiMenuLine,
  RiArrowDownSLine,
  RiCloseLine,
} from 'react-icons/ri';
import './Navbar.css';

const Navbar = () => {
  const [notice, setNotice] = useState('Welcome to our website!');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        // Check if the user is already on the Viewpage
        const isViewpage = window.location.pathname === '/user-viewpage';

        // If not on the Viewpage, navigate to it first
        if (!isViewpage) {
          navigate('/user-viewpage');
        }

        // Send search query to the backend
        const response = await axios.post('http://localhost:8082/api/user/product-search', {
          query: searchQuery,
        });

        // Pass the search results to the Viewpage using state
        navigate('/user-viewpage', {
          state: { searchResults: response.data.products },
        });
      } catch (err) {
        console.error('Error sending search query to backend:', err);
      }
    }
  };

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
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const toggleDropdown = (category) => {
    setActiveDropdown(activeDropdown === category ? null : category);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMobileCategory = (category) => {
    if (expandedCategories.includes(category)) {
      setExpandedCategories(expandedCategories.filter((cat) => cat !== category));
    } else {
      setExpandedCategories([...expandedCategories, category]);
    }
  };

  // Function to navigate when an icon is clicked
  const handleNavigation = (path) => {
    navigate(path);
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

          <form className="search-bar" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button type="submit">
              <RiSearchLine />
            </button>
          </form>

          <div className="icons">
            <div className="icon-item" onClick={() => handleNavigation('/cart')}>
              <RiHeartLine />
              <span>Wishlist</span>
            </div>
            <div className="icon-item" onClick={() => handleNavigation('/cart')}>
              <RiNotificationLine />
              <span>Notification</span>
            </div>
            <div className="icon-item" onClick={() => handleNavigation('/user-shopping-cart')}>
              <RiShoppingCartLine />
              <span>Cart</span>
            </div>
            <div className="icon-item" onClick={() => handleNavigation('/user-account')}>
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
            <div className="mobile-category" onClick={() => toggleMobileCategory('HOME')}>
              HOME
            </div>
            <div className="mobile-category" onClick={() => toggleMobileCategory('WOMEN')}>
              WOMEN {expandedCategories.includes('WOMEN') ? '▼' : '▶'}
              {expandedCategories.includes('WOMEN') && (
                <div className="mobile-subcategories">
                  <div className="mobile-subcategory">New Arrivals</div>
                  <div className="mobile-subcategory">
                    Tops & Tees {expandedCategories.includes('TOPS') ? '▼' : '▶'}
                    {expandedCategories.includes('TOPS') && (
                      <div className="mobile-subcategory-items">
                        <div className="mobile-subcategory-item">Blouses</div>
                        <div className="mobile-subcategory-item">Crop Tops</div>
                      </div>
                    )}
                  </div>
                  <div className="mobile-subcategory">
                    Dresses & Bottoms {expandedCategories.includes('DRESSES') ? '▼' : '▶'}
                    {expandedCategories.includes('DRESSES') && (
                      <div className="mobile-subcategory-items">
                        <div className="mobile-subcategory-item">Dresses & Frocks</div>
                        <div className="mobile-subcategory-item">Skirts</div>
                        <div className="mobile-subcategory-item">Trousers</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="mobile-category" onClick={() => toggleMobileCategory('WATCHES')}>
              WATCHES {expandedCategories.includes('WATCHES') ? '▼' : '▶'}
              {expandedCategories.includes('WATCHES') && (
                <div className="mobile-subcategories">
                  <div className="mobile-subcategory">Men&apos;s Watches</div>
                  <div className="mobile-subcategory">Women&apos;s Watches</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;