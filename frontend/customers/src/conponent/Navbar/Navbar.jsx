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
  const handleCategoryClick = async (category, level) => {
    console.log('Category clicked:', category, 'Level:', level);
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
        payload = { cat2: trimmedCategory }; // Level 2: Subcategory (e.g., Tops & Tees)
      } else if (level === 3) {
        payload = { cat3: trimmedCategory }; // Level 3: Sub-subcategory (e.g., Blouses)
      }
  
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
              onClick={() => handleCategoryClick('WOMEN',1)}
            >
              WOMEN <RiArrowDownSLine className="dropdown-arrow" />
              {activeDropdown === 'WOMEN' && (
                <div className="dropdown">

                  <div className="dropdown-item">New Arrivals</div>

                  <div className="dropdown-item" onClick={() => handleCategoryClick('Tops & Tees',2)}>
                    Tops & Tees <RiArrowDownSLine className="dropdown-arrow" />
                    <div className="sub-dropdown">
                      <div className="sub-dropdown-item" onClick={() => handleCategoryClick('Blouses',3)}>Blouses</div>
                      <div className="sub-dropdown-item" onClick={() => handleCategoryClick('Crop Tops',3)}>Crop Tops</div>
                      <div className="sub-dropdown-item" onClick={() => handleCategoryClick('T-Shirts',3)}>T-Shirts</div>
                      <div className="sub-dropdown-item" onClick={() => handleCategoryClick('Hoodies & Sweaters',3)}>Hoodies & Sweaters</div>
                    </div>
                  </div>

                  <div className="dropdown-item" onClick={() => handleCategoryClick('Dresses & Bottoms',2)}>
                    Dresses & Bottoms <RiArrowDownSLine className="dropdown-arrow" />
                    <div className="sub-dropdown">
                      <div className="sub-dropdown-item" onClick={() => handleCategoryClick('Dresses & Frocks',3)}>Dresses & Frocks</div>
                      <div className="sub-dropdown-item" onClick={() => handleCategoryClick('Skirts',3)}>Skirts</div>
                      <div className="sub-dropdown-item" onClick={() => handleCategoryClick('Trousers',3)}>Trousers</div>
                      <div className="sub-dropdown-item" onClick={() => handleCategoryClick('Denims',3)}>Denims</div>
                      <div className="sub-dropdown-item" onClick={() => handleCategoryClick('Shorts',3)}>Shorts</div>
                      <div className="sub-dropdown-item" onClick={() => handleCategoryClick('Pants',3)}>Pants</div>
                    </div>
                  </div>

                  <div className="dropdown-item" onClick={() => handleCategoryClick('Special Categories',3)}>
                    Special Categories <RiArrowDownSLine className="dropdown-arrow" />
                    <div className="sub-dropdown">
                      <div className="sub-dropdown-item" onClick={() => handleCategoryClick('Jumpsuits',3)}>Jumpsuits</div>
                      <div className="sub-dropdown-item" onClick={() => handleCategoryClick('Bodysuits',3)}>Bodysuits</div>
                      <div className="sub-dropdown-item" onClick={() => handleCategoryClick('Office Wear',3)}>Office Wear</div>
                      <div className="sub-dropdown-item" onClick={() => handleCategoryClick('Gym Wear',3)}>Gym Wear</div>
                      <div className="sub-dropdown-item" onClick={() => handleCategoryClick('Night & Loungewear',3)}>Night & Loungewear</div>
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
              onClick={() => handleCategoryClick('MEN',1)}
            >
              MEN <RiArrowDownSLine className="dropdown-arrow" />
              {activeDropdown === 'MEN' && (
                <div className="dropdown">
                  <div className="dropdown-item">New Arrivals</div>
                  <div className="dropdown-item" onClick={() => handleCategoryClick('Tops',2)}>
                    Tops <RiArrowDownSLine className="dropdown-arrow" />
                    <div className="sub-dropdown">
                      <div className="sub-dropdown-item" onClick={() => handleCategoryClick('Shirts',3)}>Shirts</div>
                      <div className="sub-dropdown-item" onClick={() => handleCategoryClick('T-Shirts',3)}>T-Shirts</div>
                      <div className="sub-dropdown-item" onClick={() => handleCategoryClick('Hoodies & Sweaters',3)}>Hoodies & Sweaters</div>
                    </div>
                  </div>
                  <div className="dropdown-item" onClick={() => handleCategoryClick('Bottoms',2)}>
                    Bottoms <RiArrowDownSLine className="dropdown-arrow" />
                    <div className="sub-dropdown">
                      <div className="sub-dropdown-item" onClick={() => handleCategoryClick('Trousers',3)}>Trousers</div>
                      <div className="sub-dropdown-item" onClick={() => handleCategoryClick('Denims',3)}>Denims</div>
                      <div className="sub-dropdown-item" onClick={() => handleCategoryClick('Shorts',3)}>Shorts</div>
                      <div className="sub-dropdown-item" onClick={() => handleCategoryClick('Pants',3)}>Pants</div>
                    </div>
                  </div>
                  <div className="dropdown-item" onClick={() => handleCategoryClick('Special Categorie',2)}>
                    Special Categories <RiArrowDownSLine className="dropdown-arrow" />
                    <div className="sub-dropdown">
                      <div className="sub-dropdown-item" onClick={() => handleCategoryClick('Office Wear',3)}>Office Wear</div>
                      <div className="sub-dropdown-item" onClick={() => handleCategoryClick('Gym Wear',3)}>Gym Wear</div>
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
              KIDS & BABY <RiArrowDownSLine className="dropdown-arrow" />
              {activeDropdown === 'KIDS & BABY' && (
                <div className="dropdown">
                  <div className="dropdown-item">New Arrivals</div>
                  <div className="dropdown-item">Boys' Clothing (3-16)</div>
                  <div className="dropdown-item">Girls' Clothing (3-16)</div>
                  <div className="dropdown-item">Kids' Footwear</div>
                  <div className="dropdown-item">
                    Bags & Accessories <RiArrowDownSLine className="dropdown-arrow" />
                    <div className="sub-dropdown">
                      <div className="sub-dropdown-item">Kids' Bags</div>
                      <div className="sub-dropdown-item">Kids' Watches</div>
                      <div className="sub-dropdown-item">Hats & Caps</div>
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