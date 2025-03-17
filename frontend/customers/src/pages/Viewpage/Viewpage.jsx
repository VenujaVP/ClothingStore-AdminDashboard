/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import withAuth from '../withAuth'; // Import the HOC
import './Viewpage.css';

const Viewpage = () => {
  const [products, setProducts] = useState([]); // State to store product data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors
  const [currentPage, setCurrentPage] = useState(1); // State for pagination
  const productsPerPage = 4; // Number of products per page

  // Fetch product details from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8082/api/user/product-fetch'); // Replace with your backend API endpoint
        setProducts(response.data.products); // Set the fetched data to state
        setLoading(false); // Set loading to false
      } catch (err) {
        setError(err.message); // Set error message
        setLoading(false); // Set loading to false
      }
    };

    fetchProducts();
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Get current products for the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Function to render star ratings
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<span key={i} className="star filled">★</span>); // Filled star
      } else {
        stars.push(<span key={i} className="star">☆</span>); // Empty star
      }
    }
    return stars;
  };

  if (loading) {
    return <div className="loading">Loading...</div>; // Show loading message
  }

  if (error) {
    return <div className="error">Error: {error}</div>; // Show error message
  }

  return (
    <div className="dashboard">
      <div className="product-grid">
        {currentProducts.map((product) => (
          <div key={product.product_id} className="product-card">
            <img src="https://via.placeholder.com/200" alt={product.product_name} className="product-image" />
            <div className="product-details">
              <h2 className="product-name">{product.product_name}</h2>
              <p className="product-description">
                {product.product_description.length > 100
                  ? `${product.product_description.substring(0, 100)}...`
                  : product.product_description}
              </p>
              <div className="product-price">LKR {product.unit_price}</div>
              <div className="product-rating">
                {renderStars(product.rating)} ({product.rating})
              </div>
              <div className="product-stock">
                {product.total_units > 0 ? (
                  <span className="in-stock">In Stock </span>
                ) : (
                  <span className="sold-out">Sold Out </span>
                )}
                {product.total_units > 0 && product.total_units < 10 && (
                  <span className="low-stock">
                    (Only {product.total_units} {product.total_units === 1 ? 'item' : 'items'} left)
                  </span>
                )}
              </div>
              <div className="wishlist-count">Wishlist: {product.wishlist_count}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

const AuthenticatedViewpage = withAuth(Viewpage);
export default AuthenticatedViewpage;