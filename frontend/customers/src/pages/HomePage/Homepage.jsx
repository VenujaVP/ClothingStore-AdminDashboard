/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */

import React from 'react';
import './Homepage.css';
import withAuth from '../withAuth'; // Import the HOC

const Homepage = () => {
  // Sample data for featured products
  const featuredProducts = [
    {
      id: 1,
      name: 'Product 1',
      price: 200,
      rating: 4.2,
      image: 'https://via.placeholder.com/300',
      description: 'This is a short description of Product 1.',
    },
    {
      id: 2,
      name: 'Product 2',
      price: 300,
      rating: 4.5,
      image: 'https://via.placeholder.com/300',
      description: 'This is a short description of Product 2.',
    },
    {
      id: 3,
      name: 'Product 3',
      price: 250,
      rating: 4.0,
      image: 'https://via.placeholder.com/300',
      description: 'This is a short description of Product 3.',
    },
    {
      id: 4,
      name: 'Product 4',
      price: 400,
      rating: 4.7,
      image: 'https://via.placeholder.com/300',
      description: 'This is a short description of Product 4.',
    },
  ];

  // Sample data for categories
  const categories = [
    { id: 1, name: 'Men', image: 'https://via.placeholder.com/300' },
    { id: 2, name: 'Women', image: 'https://via.placeholder.com/300' },
    { id: 3, name: 'Kids', image: 'https://via.placeholder.com/300' },
    { id: 4, name: 'Accessories', image: 'https://via.placeholder.com/300' },
  ];

  // Sample data for testimonials
  const testimonials = [
    {
      id: 1,
      name: 'John Doe',
      comment: 'Great products and fast delivery! Highly recommended.',
      rating: 5,
      image: 'https://via.placeholder.com/100',
    },
    {
      id: 2,
      name: 'Jane Smith',
      comment: 'Love the quality and customer service. Will shop again!',
      rating: 4.5,
      image: 'https://via.placeholder.com/100',
    },
    {
      id: 3,
      name: 'Alice Johnson',
      comment: 'Excellent experience. The products are top-notch!',
      rating: 4.8,
      image: 'https://via.placeholder.com/100',
    },
  ];

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

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Our Store</h1>
          <p>Discover the best products at amazing prices.</p>
          <button className="cta-button">Shop Now</button>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products">
        <h2>Featured Products</h2>
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <div className="product-details">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-price">LKR {product.price}</div>
                <div className="product-rating">{renderStars(product.rating)}</div>
                <button className="add-to-cart">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <h2>Shop by Category</h2>
        <div className="category-grid">
          {categories.map((category) => (
            <div key={category.id} className="category-card">
              <img src={category.image} alt={category.name} className="category-image" />
              <h3 className="category-name">{category.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>What Our Customers Say</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <img src={testimonial.image} alt={testimonial.name} className="testimonial-image" />
              <div className="testimonial-rating">{renderStars(testimonial.rating)}</div>
              <p className="testimonial-comment">&ldquo;{testimonial.comment}&rdquo;</p>
              <p className="testimonial-name">- {testimonial.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <h2>Subscribe to Our Newsletter</h2>
        <p>Get the latest updates on new products and exclusive offers.</p>
        <form className="newsletter-form">
          <input type="email" placeholder="Enter your email" required />
          <button type="submit">Subscribe</button>
        </form>
      </section>
    </div>
  );
};

// export default Homepage;
const AuthenticatedHomepage = withAuth(Homepage);
export default AuthenticatedHomepage;