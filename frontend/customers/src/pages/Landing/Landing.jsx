/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';
import { FaArrowRight, FaTruck, FaCreditCard, FaHeadset } from 'react-icons/fa';

// Reusable ProductCard Component
const ProductCard = ({ image, name, price }) => (
  <div className="product-card">
    <div className="product-image">
      <img src={image} alt={name} />
      <div className="product-overlay">
        <button className="quick-view-btn">Quick View</button>
      </div>
    </div>
    <div className="product-info">
      <h4>{name}</h4>
      <p className="price">${price}</p>
    </div>
  </div>
);

const Landing = () => {
  const products = [
    { image: 'items/1.jpg', name: 'Product 1', price: '49.99' },
    { image: 'items/2.jpg', name: 'Product 2', price: '79.99' },
    { image: 'items/3.jpg', name: 'Product 3', price: '99.99' },
    { image: 'items/4.jpg', name: 'Product 4', price: '89.99' },
    { image: 'items/5.jpg', name: 'Product 5', price: '69.99' },
    { image: 'items/6.jpg', name: 'Product 6', price: '59.99' },
    { image: 'items/7.jpg', name: 'Product 7', price: '109.99' },
    { image: 'items/8.jpg', name: 'Product 8', price: '99.99' },
  ];

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Discover Your Style</h1>
          <p>Explore the latest fashion trends and express yourself</p>
          <Link to="/shop" className="shop-now-btn">
            Shop Now <FaArrowRight className="arrow-icon" />
          </Link>
        </div>
        <div className="hero-image">
          <img src="./1123.png" alt="Fashion Collection" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="feature-card">
          <FaTruck className="feature-icon" />
          <h3>Free Shipping</h3>
          <p>On orders over $50</p>
        </div>
        <div className="feature-card">
          <FaCreditCard className="feature-icon" />
          <h3>Secure Payment</h3>
          <p>100% secure payment</p>
        </div>
        <div className="feature-card">
          <FaHeadset className="feature-icon" />
          <h3>24/7 Support</h3>
          <p>Dedicated support</p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <h2>Shop by Category</h2>
        <div className="category-grid">
          <div className="category-card">
            <img src="3.jpg" alt="Men's Fashion" />
            <div className="category-content">
              <h3>Men Fashion</h3>
              <Link to="/category/men" className="category-link">
                Explore <FaArrowRight />
              </Link>
            </div>
          </div>
          <div className="category-card">
            <img src="1.jpg" alt="Women's Fashion" />
            <div className="category-content">
              <h3>Womens Fashion</h3>
              <Link to="/category/women" className="category-link">
                Explore <FaArrowRight />
              </Link>
            </div>
          </div>
          <div className="category-card">
            <img src="2.jpg" alt="Accessories" />
            <div className="category-content">
              <h3>Accessories</h3>
              <Link to="/category/accessories" className="category-link">
                Explore <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <h2>Featured Products</h2>
        <div className="product-grid">
          {products.map((product, index) => (
            <ProductCard
              key={index}
              image={product.image}
              name={product.name}
              price={product.price}
            />
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <h2>Subscribe to Our Newsletter</h2>
          <p>Get the latest updates on new products and upcoming sales</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Landing;
