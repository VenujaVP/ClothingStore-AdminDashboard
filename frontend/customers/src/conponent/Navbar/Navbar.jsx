//component/Navbar/Navbar.jsx

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
  
    // Trim the search query and check if it's empty
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      alert('Please enter a search term.'); // Provide user feedback
      return;
    }
  
    try {
      // Send search query to the backend
      const response = await axios.post('http://localhost:8082/api/user/product-search', {
        query: trimmedQuery,
      });
  
      // Log the response for debugging
      console.log('Backend Response:', response);
  
      // Ensure the response contains the expected data
      if (!response.data || !Array.isArray(response.data.products)) {
        throw new Error('Invalid response from the server');
      }
  
      // Pass the search results to the Viewpage using state
      navigate('/user-viewpage', {
        state: { searchResults: response.data.products },
      });
    } catch (err) {
      console.error('Error sending search query to backend:', err);
  
      // Provide user-friendly error feedback
      alert('An error occurred while searching. Please try again.');
  
      // Optionally, navigate to the Viewpage with an empty state
      navigate('/user-viewpage', {
        state: { searchResults: [] },
      });
    }
  };

//-------------------------------------------------------------------------------------------

  // Handle category click
  const handleCategoryClick = async (category, level, parentCategory1, parentCategory2, event) => {
    // Stop event propagation to prevent multiple requests
    if (event) {
      event.stopPropagation();
    }
  
    // Trim the category and check if it's empty
    const trimmedCategory = category.trim();
    if (!trimmedCategory) {
      alert('Please select a valid category.'); // Provide user feedback
      return;
    }
  
    try {
      // Prepare the payload based on the category level
      let payload = {};
  
      if (level === 1) {
        payload = { cat1: trimmedCategory }; // Level 1: Main category (e.g., WOMEN)
      } else if (level === 2) {
        // Include the parent category (Level 1) for Level 2
        payload = { cat1: parentCategory1, cat2: trimmedCategory };
      } else if (level === 3) {
        // Include the parent categories (Level 1 and Level 2) for Level 3
        payload = { cat1: parentCategory1, cat2: parentCategory2, cat3: trimmedCategory };
      }
  
      console.log('Payload:', payload); // Log the payload for debugging
  
      // Send the category to the backend for filtering
      const response = await axios.post('http://localhost:8082/api/user/category-filter', payload);
  
      // Log the response for debugging
      console.log('Backend Response:', response);
  
      // Ensure the response contains the expected data
      if (!response.data || !Array.isArray(response.data.products)) {
        throw new Error('Invalid response from the server');
      }
  
      // Pass the filtered results to the Viewpage using state
      navigate('/user-viewpage', {
        state: { searchResults: response.data.products },
      });
    } catch (err) {
      console.error('Error filtering products by category:', err);
  
      // Provide user-friendly error feedback
      alert('An error occurred while filtering. Please try again.');
  
      // Optionally, navigate to the Viewpage with an empty state
      navigate('/user-viewpage', {
        state: { searchResults: [] },
      });
    }
  };

//-------------------------------------------------------------------------------------------

  const toggleDropdown = (category) => {
    setActiveDropdown(activeDropdown === category ? null : category);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMobileCategory = (category) => {
    if (expandedCategories.includes(category)) {
      // If the category is already expanded, collapse it
      setExpandedCategories(expandedCategories.filter((cat) => cat !== category));
    } else {
      // If the category is not expanded, expand it
      setExpandedCategories([...expandedCategories, category]);
    }
  };

//-------------------------------------------------------------------------------------------

  // Function to navigate when an icon is clicked
  const handleNavigation = (path) => {
    navigate(path);
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

            {/* WOMEN */}
            <div
              className="category"
              onMouseEnter={() => toggleDropdown('WOMEN')}
              onMouseLeave={() => toggleDropdown(null)}
              onClick={(e) => handleCategoryClick('WOMEN', 1, null, null, e)} // Level 1: Main category
            >
              WOMEN <RiArrowDownSLine className="dropdown-arrow" />
              {activeDropdown === 'WOMEN' && (
                <div className="dropdown">
                  {/* Level 1: New Arrivals */}
                  <div className="dropdown-item" onClick={(e) => handleCategoryClick('New Arrivals', 1, null, null, e)}>
                    New Arrivals
                  </div>

                  {/* Level 2: Tops & Tees */}
                  <div className="dropdown-item" onClick={(e) => handleCategoryClick('Tops & Tees', 2, 'WOMEN', null, e)}>
                    Tops & Tees <RiArrowDownSLine className="dropdown-arrow" />
                    {/* Level 3: Subcategories of Tops & Tees */}
                    <div className="sub-dropdown">
                      <div className="sub-dropdown-item" onClick={(e) => handleCategoryClick('Blouses', 3, 'WOMEN', 'Tops & Tees', e)}>
                        Blouses
                      </div>
                      <div className="sub-dropdown-item" onClick={(e) => handleCategoryClick('Crop Tops', 3, 'WOMEN', 'Tops & Tees', e)}>
                        Crop Tops
                      </div>
                      <div className="sub-dropdown-item" onClick={(e) => handleCategoryClick('T-Shirts', 3, 'WOMEN', 'Tops & Tees', e)}>
                        T-Shirts
                      </div>
                      <div className="sub-dropdown-item" onClick={(e) => handleCategoryClick('Hoodies & Sweaters', 3, 'WOMEN', 'Tops & Tees', e)}>
                        Hoodies & Sweaters
                      </div>
                    </div>
                  </div>

                  {/* Level 2: Dresses & Bottoms */}
                  <div className="dropdown-item" onClick={(e) => handleCategoryClick('Dresses & Bottoms', 2, 'WOMEN', null, e)}>
                    Dresses & Bottoms <RiArrowDownSLine className="dropdown-arrow" />
                    {/* Level 3: Subcategories of Dresses & Bottoms */}
                    <div className="sub-dropdown">
                      <div className="sub-dropdown-item" onClick={(e) => handleCategoryClick('Dresses & Frocks', 3, 'WOMEN', 'Dresses & Bottoms', e)}>
                        Dresses & Frocks
                      </div>
                      <div className="sub-dropdown-item" onClick={(e) => handleCategoryClick('Skirts', 3, 'WOMEN', 'Dresses & Bottoms', e)}>
                        Skirts
                      </div>
                      <div className="sub-dropdown-item" onClick={(e) => handleCategoryClick('Trousers', 3, 'WOMEN', 'Dresses & Bottoms', e)}>
                        Trousers
                      </div>
                      <div className="sub-dropdown-item" onClick={(e) => handleCategoryClick('Denims', 3, 'WOMEN', 'Dresses & Bottoms', e)}>
                        Denims
                      </div>
                      <div className="sub-dropdown-item" onClick={(e) => handleCategoryClick('Shorts', 3, 'WOMEN', 'Dresses & Bottoms', e)}>
                        Shorts
                      </div>
                      <div className="sub-dropdown-item" onClick={(e) => handleCategoryClick('Pants', 3, 'WOMEN', 'Dresses & Bottoms', e)}>
                        Pants
                      </div>
                    </div>
                  </div>

                  {/* Level 2: Special Categories */}
                  <div className="dropdown-item" onClick={(e) => handleCategoryClick('Special Categories', 2, 'WOMEN', null, e)}>
                    Special Categories <RiArrowDownSLine className="dropdown-arrow" />
                    {/* Level 3: Subcategories of Special Categories */}
                    <div className="sub-dropdown">
                      <div className="sub-dropdown-item" onClick={(e) => handleCategoryClick('Jumpsuits', 3, 'WOMEN', 'Special Categories', e)}>
                        Jumpsuits
                      </div>
                      <div className="sub-dropdown-item" onClick={(e) => handleCategoryClick('Bodysuits', 3, 'WOMEN', 'Special Categories', e)}>
                        Bodysuits
                      </div>
                      <div className="sub-dropdown-item" onClick={(e) => handleCategoryClick('Office Wear', 3, 'WOMEN', 'Special Categories', e)}>
                        Office Wear
                      </div>
                      <div className="sub-dropdown-item" onClick={(e) => handleCategoryClick('Gym Wear', 3, 'WOMEN', 'Special Categories', e)}>
                        Gym Wear
                      </div>
                      <div className="sub-dropdown-item" onClick={(e) => handleCategoryClick('Night & Loungewear', 3, 'WOMEN', 'Special Categories', e)}>
                        Night & Loungewear
                      </div>
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
              onClick={(e) => handleCategoryClick('MEN', 1, null, null, e)} // Level 1: Main category
            >
              MEN <RiArrowDownSLine className="dropdown-arrow" />
              {activeDropdown === 'MEN' && (
                <div className="dropdown">
                  {/* Level 1: New Arrivals */}
                  <div className="dropdown-item" onClick={(e) => handleCategoryClick('New Arrivals', 1, null, null, e)}>
                    New Arrivals
                  </div>

                  {/* Level 2: Tops */}
                  <div className="dropdown-item" onClick={(e) => handleCategoryClick('Tops', 2, 'MEN', null, e)}>
                    Tops <RiArrowDownSLine className="dropdown-arrow" />
                    {/* Level 3: Subcategories of Tops */}
                    <div className="sub-dropdown">
                      <div className="sub-dropdown-item" onClick={(e) => handleCategoryClick('Shirts', 3, 'MEN', 'Tops', e)}>
                        Shirts
                      </div>
                      <div className="sub-dropdown-item" onClick={(e) => handleCategoryClick('T-Shirts', 3, 'MEN', 'Tops', e)}>
                        T-Shirts
                      </div>
                      <div className="sub-dropdown-item" onClick={(e) => handleCategoryClick('Hoodies & Sweaters', 3, 'MEN', 'Tops', e)}>
                        Hoodies & Sweaters
                      </div>
                    </div>
                  </div>

                  {/* Level 2: Bottoms */}
                  <div className="dropdown-item" onClick={(e) => handleCategoryClick('Bottoms', 2, 'MEN', null, e)}>
                    Bottoms <RiArrowDownSLine className="dropdown-arrow" />
                    {/* Level 3: Subcategories of Bottoms */}
                    <div className="sub-dropdown">
                      <div className="sub-dropdown-item" onClick={(e) => handleCategoryClick('Trousers', 3, 'MEN', 'Bottoms', e)}>
                        Trousers
                      </div>
                      <div className="sub-dropdown-item" onClick={(e) => handleCategoryClick('Denims', 3, 'MEN', 'Bottoms', e)}>
                        Denims
                      </div>
                      <div className="sub-dropdown-item" onClick={(e) => handleCategoryClick('Shorts', 3, 'MEN', 'Bottoms', e)}>
                        Shorts
                      </div>
                      <div className="sub-dropdown-item" onClick={(e) => handleCategoryClick('Pants', 3, 'MEN', 'Bottoms', e)}>
                        Pants
                      </div>
                    </div>
                  </div>

                  {/* Level 2: Special Categories */}
                  <div className="dropdown-item" onClick={(e) => handleCategoryClick('Special Categories', 2, 'MEN', null, e)}>
                    Special Categories <RiArrowDownSLine className="dropdown-arrow" />
                    {/* Level 3: Subcategories of Special Categories */}
                    <div className="sub-dropdown">
                      <div className="sub-dropdown-item" onClick={(e) => handleCategoryClick('Office Wear', 3, 'MEN', 'Special Categories', e)}>
                        Office Wear
                      </div>
                      <div className="sub-dropdown-item" onClick={(e) => handleCategoryClick('Gym Wear', 3, 'MEN', 'Special Categories', e)}>
                        Gym Wear
                      </div>
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
              onClick={(e) => handleCategoryClick('KIDS & BABY', 1, null, null, e)} // Level 1: Main category
            >
              KIDS & BABY <RiArrowDownSLine className="dropdown-arrow" />
              {activeDropdown === 'KIDS & BABY' && (
                <div className="dropdown">
                  {/* Level 1: New Arrivals */}
                  <div className="dropdown-item" onClick={(e) => handleCategoryClick('New Arrivals', 1, null, null, e)}>
                    New Arrivals
                  </div>

                  {/* Level 2: Boys' Clothing (3-16) */}
                  <div className="dropdown-item" onClick={(e) => handleCategoryClick("Boys' Clothing (3-16)", 2, 'KIDS & BABY', null, e)}>
                    Boys' Clothing (3-16)
                  </div>

                  {/* Level 2: Girls' Clothing (3-16) */}
                  <div className="dropdown-item" onClick={(e) => handleCategoryClick("Girls' Clothing (3-16)", 2, 'KIDS & BABY', null, e)}>
                    Girls' Clothing (3-16)
                  </div>

                  {/* Level 2: Kids' Footwear */}
                  <div className="dropdown-item" onClick={(e) => handleCategoryClick("Kids' Footwear", 2, 'KIDS & BABY', null, e)}>
                    Kids' Footwear
                  </div>

                  {/* Level 2: Bags & Accessories */}
                  <div className="dropdown-item" onClick={(e) => handleCategoryClick("Bags & Accessories", 2, 'KIDS & BABY', null, e)}>
                    Bags & Accessories <RiArrowDownSLine className="dropdown-arrow" />
                    {/* Level 3: Subcategories of Bags & Accessories */}
                    <div className="sub-dropdown">
                      <div className="sub-dropdown-item" onClick={(e) => handleCategoryClick("Kids' Bags", 3, 'KIDS & BABY', 'Bags & Accessories', e)}>
                        Kids' Bags
                      </div>
                      <div className="sub-dropdown-item" onClick={(e) => handleCategoryClick("Kids' Watches", 3, 'KIDS & BABY', 'Bags & Accessories', e)}>
                        Kids' Watches
                      </div>
                      <div className="sub-dropdown-item" onClick={(e) => handleCategoryClick("Hats & Caps", 3, 'KIDS & BABY', 'Bags & Accessories', e)}>
                        Hats & Caps
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* WATCHES */}
            <div
              className="category"
              onMouseEnter={() => toggleDropdown('WATCHES')}
              onMouseLeave={() => toggleDropdown(null)}
            >
              WATCHES <RiArrowDownSLine className="dropdown-arrow" />
              {activeDropdown === 'WATCHES' && (
                <div className="dropdown">
                  <div className="dropdown-item">Men's Watches</div>
                  <div className="dropdown-item">Women's Watches</div>
                </div>
              )}
            </div>

            {/* FOOTWEAR */}
            <div
              className="category"
              onMouseEnter={() => toggleDropdown('FOOTWEAR')}
              onMouseLeave={() => toggleDropdown(null)}
            >
              FOOTWEAR <RiArrowDownSLine className="dropdown-arrow" />
              {activeDropdown === 'FOOTWEAR' && (
                <div className="dropdown">
                  <div className="dropdown-item">Men's Watches</div>
                  <div className="dropdown-item">Women's Watches</div>
                </div>
              )}
            </div>

            {/* ACCESSORIES */}
            <div
              className="category"
              onMouseEnter={() => toggleDropdown('ACCESSORIES')}
              onMouseLeave={() => toggleDropdown(null)}
            >
              ACCESSORIES <RiArrowDownSLine className="dropdown-arrow" />
              {activeDropdown === 'ACCESSORIES' && (
                <div className="dropdown">
                  <div className="dropdown-item">Belts</div>
                  <div className="dropdown-item">Wallets</div>

                  <div className="dropdown-item">
                    Bags & Backpacks <RiArrowDownSLine className="dropdown-arrow" />
                    <div className="sub-dropdown">
                      <div className="sub-dropdown-item">Handbags</div>
                      <div className="sub-dropdown-item">Backpacks</div>
                      <div className="sub-dropdown-item">Travel Bags</div>
                    </div>
                  </div>

                  <div className="dropdown-item">
                  Headwear <RiArrowDownSLine className="dropdown-arrow" />
                    <div className="sub-dropdown">
                      <div className="sub-dropdown-item">Caps</div>
                      <div className="sub-dropdown-item">Ice Caps</div>
                      <div className="sub-dropdown-item">Hats</div>
                      <div className="sub-dropdown-item">Beanies</div>
                    </div>
                  </div>
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
            {/* HOME */}
            <div className="mobile-category" onClick={() => toggleMobileCategory('HOME')}>
              HOME
            </div>

            {/* WOMEN */}
            <div className="mobile-category" onClick={() => toggleMobileCategory('WOMEN')}>
              WOMEN {expandedCategories.includes('WOMEN') ? '▼' : '▶'}
              {expandedCategories.includes('WOMEN') && (
                <div className="mobile-subcategories">
                  <div className="mobile-subcategory">New Arrivals</div>
                  <div className="mobile-subcategory" onClick={(e) => {
                    e.stopPropagation();
                    toggleMobileCategory('TOPS');
                  }}>
                    Tops & Tees {expandedCategories.includes('TOPS') ? '▼' : '▶'}
                    {expandedCategories.includes('TOPS') && (
                      <div className="mobile-subcategory-items">
                        <div className="mobile-subcategory-item">Blouses</div>
                        <div className="mobile-subcategory-item">Crop Tops</div>
                        <div className="mobile-subcategory-item">T-Shirts</div>
                        <div className="mobile-subcategory-item">Hoodies & Sweaters</div>
                      </div>
                    )}
                  </div>
                  <div className="mobile-subcategory" onClick={(e) => {
                    e.stopPropagation();
                    toggleMobileCategory('DRESSES');
                  }}>
                    Dresses & Bottoms {expandedCategories.includes('DRESSES') ? '▼' : '▶'}
                    {expandedCategories.includes('DRESSES') && (
                      <div className="mobile-subcategory-items">
                        <div className="mobile-subcategory-item">Dresses & Frocks</div>
                        <div className="mobile-subcategory-item">Skirts</div>
                        <div className="mobile-subcategory-item">Trousers</div>
                        <div className="mobile-subcategory-item">Denims</div>
                        <div className="mobile-subcategory-item">Shorts</div>
                        <div className="mobile-subcategory-item">Pants</div>
                      </div>
                    )}
                  </div>
                  <div className="mobile-subcategory" onClick={(e) => {
                    e.stopPropagation();
                    toggleMobileCategory('SPECIAL_WOMEN');
                  }}>
                    Special Categories {expandedCategories.includes('SPECIAL_WOMEN') ? '▼' : '▶'}
                    {expandedCategories.includes('SPECIAL_WOMEN') && (
                      <div className="mobile-subcategory-items">
                        <div className="mobile-subcategory-item">Jumpsuits</div>
                        <div className="mobile-subcategory-item">Bodysuits</div>
                        <div className="mobile-subcategory-item">Office Wear</div>
                        <div className="mobile-subcategory-item">Gym Wear</div>
                        <div className="mobile-subcategory-item">Night & Loungewear</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* MEN */}
            <div className="mobile-category" onClick={() => toggleMobileCategory('MEN')}>
              MEN {expandedCategories.includes('MEN') ? '▼' : '▶'}
              {expandedCategories.includes('MEN') && (
                <div className="mobile-subcategories">
                  <div className="mobile-subcategory">New Arrivals</div>
                  <div className="mobile-subcategory" onClick={(e) => {
                    e.stopPropagation();
                    toggleMobileCategory('TOPS_MEN');
                  }}>
                    Tops {expandedCategories.includes('TOPS_MEN') ? '▼' : '▶'}
                    {expandedCategories.includes('TOPS_MEN') && (
                      <div className="mobile-subcategory-items">
                        <div className="mobile-subcategory-item">Shirts</div>
                        <div className="mobile-subcategory-item">T-Shirts</div>
                        <div className="mobile-subcategory-item">Hoodies & Sweaters</div>
                      </div>
                    )}
                  </div>
                  <div className="mobile-subcategory" onClick={(e) => {
                    e.stopPropagation();
                    toggleMobileCategory('BOTTOMS_MEN');
                  }}>
                    Bottoms {expandedCategories.includes('BOTTOMS_MEN') ? '▼' : '▶'}
                    {expandedCategories.includes('BOTTOMS_MEN') && (
                      <div className="mobile-subcategory-items">
                        <div className="mobile-subcategory-item">Trousers</div>
                        <div className="mobile-subcategory-item">Denims</div>
                        <div className="mobile-subcategory-item">Shorts</div>
                        <div className="mobile-subcategory-item">Pants</div>
                      </div>
                    )}
                  </div>
                  <div className="mobile-subcategory" onClick={(e) => {
                    e.stopPropagation();
                    toggleMobileCategory('SPECIAL_MEN');
                  }}>
                    Special Categories {expandedCategories.includes('SPECIAL_MEN') ? '▼' : '▶'}
                    {expandedCategories.includes('SPECIAL_MEN') && (
                      <div className="mobile-subcategory-items">
                        <div className="mobile-subcategory-item">Office Wear</div>
                        <div className="mobile-subcategory-item">Gym Wear</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* KIDS & BABY */}
            <div className="mobile-category" onClick={() => toggleMobileCategory('KIDS & BABY')}>
              KIDS & BABY {expandedCategories.includes('KIDS & BABY') ? '▼' : '▶'}
              {expandedCategories.includes('KIDS & BABY') && (
                <div className="mobile-subcategories">
                  <div className="mobile-subcategory">New Arrivals</div>
                  <div className="mobile-subcategory">Boys' Clothing (3-16)</div>
                  <div className="mobile-subcategory">Girls' Clothing (3-16)</div>
                  <div className="mobile-subcategory">Kids' Footwear</div>
                  <div className="mobile-subcategory" onClick={(e) => {
                    e.stopPropagation();
                    toggleMobileCategory('BAGS_KIDS');
                  }}>
                    Bags & Accessories {expandedCategories.includes('BAGS_KIDS') ? '▼' : '▶'}
                    {expandedCategories.includes('BAGS_KIDS') && (
                      <div className="mobile-subcategory-items">
                        <div className="mobile-subcategory-item">Kids' Bags</div>
                        <div className="mobile-subcategory-item">Kids' Watches</div>
                        <div className="mobile-subcategory-item">Hats & Caps</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* WATCHES */}
            <div className="mobile-category" onClick={() => toggleMobileCategory('WATCHES')}>
              WATCHES {expandedCategories.includes('WATCHES') ? '▼' : '▶'}
              {expandedCategories.includes('WATCHES') && (
                <div className="mobile-subcategories">
                  <div className="mobile-subcategory">Men's Watches</div>
                  <div className="mobile-subcategory">Women's Watches</div>
                </div>
              )}
            </div>

            {/* FOOTWEAR */}
            <div className="mobile-category" onClick={() => toggleMobileCategory('FOOTWEAR')}>
              FOOTWEAR {expandedCategories.includes('FOOTWEAR') ? '▼' : '▶'}
              {expandedCategories.includes('FOOTWEAR') && (
                <div className="mobile-subcategories">
                  <div className="mobile-subcategory">Men's Footwear</div>
                  <div className="mobile-subcategory">Women's Footwear</div>
                </div>
              )}
            </div>

            {/* ACCESSORIES */}
            <div className="mobile-category" onClick={() => toggleMobileCategory('ACCESSORIES')}>
              ACCESSORIES {expandedCategories.includes('ACCESSORIES') ? '▼' : '▶'}
              {expandedCategories.includes('ACCESSORIES') && (
                <div className="mobile-subcategories">
                  <div className="mobile-subcategory">Belts</div>
                  <div className="mobile-subcategory">Wallets</div>
                  <div className="mobile-subcategory" onClick={(e) => {
                    e.stopPropagation();
                    toggleMobileCategory('BAGS_ACCESSORIES');
                  }}>
                    Bags & Backpacks {expandedCategories.includes('BAGS_ACCESSORIES') ? '▼' : '▶'}
                    {expandedCategories.includes('BAGS_ACCESSORIES') && (
                      <div className="mobile-subcategory-items">
                        <div className="mobile-subcategory-item">Handbags</div>
                        <div className="mobile-subcategory-item">Backpacks</div>
                        <div className="mobile-subcategory-item">Travel Bags</div>
                      </div>
                    )}
                  </div>
                  <div className="mobile-subcategory" onClick={(e) => {
                    e.stopPropagation();
                    toggleMobileCategory('HEADWEAR');
                  }}>
                    Headwear {expandedCategories.includes('HEADWEAR') ? '▼' : '▶'}
                    {expandedCategories.includes('HEADWEAR') && (
                      <div className="mobile-subcategory-items">
                        <div className="mobile-subcategory-item">Caps</div>
                        <div className="mobile-subcategory-item">Ice Caps</div>
                        <div className="mobile-subcategory-item">Hats</div>
                        <div className="mobile-subcategory-item">Beanies</div>
                      </div>
                    )}
                  </div>
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