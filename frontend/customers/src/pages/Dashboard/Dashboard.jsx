/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import withAuth from '../withAuth'; // Import the HOC
import './Dashboard.css';

const Dashboard = () => {
  const [products, setProducts] = useState([]); // State to store product data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors
  const [currentPage, setCurrentPage] = useState(1); // State for pagination
  const productsPerPage = 4; // Number of products per page

  // Fetch product details from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://api.example.com/products'); // Replace with your backend API endpoint
        setProducts(response.data); // Set the fetched data to state
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

  if (loading) {
    return <div className="loading">Loading...</div>; // Show loading message
  }

  if (error) {
    return <div className="error">Error: {error}</div>; // Show error message
  }

  return (
    <div className="dashboard">
      <h1>Product Dashboard</h1>
      <div className="product-grid">
        {currentProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-details">
              <h2 className="product-name">{product.name}</h2>
              <p className="product-description">{product.description}</p>
              <div className="product-price">LKR {product.price}</div>
              <div className="product-rating">Rating: {product.rating} ★</div>
              <div className="wishlist-count">Wishlist: {product.wishlistCount}</div> {/* Wishlist count */}
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

const AuthenticatedDashboard = withAuth(Dashboard);
export default AuthenticatedDashboard;