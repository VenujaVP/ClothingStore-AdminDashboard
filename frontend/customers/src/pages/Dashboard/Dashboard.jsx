/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState } from 'react';
import withAuth from '../withAuth'; // Import the HOC
import './Dashboard.css';

const Dashboard = () => {
  // Sample product data
  const sampleProducts = [
    {
      id: 1,
      name: 'Product 1',
      description: 'This is a description of Product 1.',
      price: 200,
      rating: 4.2,
      image: 'https://via.placeholder.com/200',
    },
    {
      id: 2,
      name: 'Product 2',
      description: 'This is a description of Product 2.',
      price: 300,
      rating: 4.5,
      image: 'https://via.placeholder.com/200',
    },
    {
      id: 3,
      name: 'Product 3',
      description: 'This is a description of Product 3.',
      price: 250,
      rating: 4.0,
      image: 'https://via.placeholder.com/200',
    },
    {
      id: 4,
      name: 'Product 4',
      description: 'This is a description of Product 4.',
      price: 400,
      rating: 4.7,
      image: 'https://via.placeholder.com/200',
    },
    {
      id: 5,
      name: 'Product 5',
      description: 'This is a description of Product 5.',
      price: 150,
      rating: 3.8,
      image: 'https://via.placeholder.com/200',
    },
    {
      id: 6,
      name: 'Product 6',
      description: 'This is a description of Product 6.',
      price: 500,
      rating: 4.9,
      image: 'https://via.placeholder.com/200',
    },
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4; // Number of products per page

  // Calculate total pages
  const totalPages = Math.ceil(sampleProducts.length / productsPerPage);

  // Get current products for the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sampleProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="dashboard">
      <div className="product-grid">
        {currentProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-details">
              <h2 className="product-name">{product.name}</h2>
              <p className="product-description">{product.description}</p>
              <div className="product-price">LKR {product.price}</div>
              <div className="product-rating">Rating: {product.rating} ★</div>
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