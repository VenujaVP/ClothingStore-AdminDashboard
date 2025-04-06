/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import withAuth from '../withAuth';
import { RiHeartLine, RiHeartFill } from 'react-icons/ri';
import { FaShoppingCart } from 'react-icons/fa';
import './ProductViewPage.css';

const ProductViewPage = () => {
  const { productId } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch product details when component mounts
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8082/api/user/fetch-procuct/${productId}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch product details');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleQuantityChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setQuantity(value);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const addToCart = () => {
    // Implement add to cart functionality
    console.log('Added to cart:', {
      productId,
      quantity,
      selectedSize,
      selectedColor
    });
  };

  const buyNow = () => {
    // Implement buy now functionality
    console.log('Buy now:', {
      productId,
      quantity,
      selectedSize,
      selectedColor
    });
  };

  if (loading) return <div className="loading">Loading product details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Product not found</div>;

  // Render star ratings
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'star-filled' : 'star-empty'}>
          {i <= rating ? '★' : '☆'}
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="product-view-page">
      <div className="product-view-container">
        {/* Product Images Section */}
        <div className="product-images">
          <img 
            src={product.image_url || 'https://via.placeholder.com/500'} 
            alt={product.product_name} 
            className="main-image" 
          />
          <div className="thumbnail-images">
            {/* You would map through product.images here if you had multiple */}
            <img src="https://via.placeholder.com/100" alt="Thumbnail 1" />
            <img src="https://via.placeholder.com/100" alt="Thumbnail 2" />
          </div>
        </div>

        {/* Product Details Section */}
        <div className="product-details">
          <h1 className="product-name">{product.product_name}</h1>
          <div className="product-rating">
            {renderStars(product.rating)} 
            <span className="rating-value">{product.rating.toFixed(1)}</span>
          </div>
          <div className="product-price">LKR {product.unit_price.toFixed(2)}</div>

          {/* Size and Color Selection */}
          <div className="product-variations">
            {product.sizes && product.sizes.length > 0 && (
              <div className="variation-group">
                <label htmlFor="size">Size:</label>
                <select 
                  id="size" 
                  name="size"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  <option value="">Select Size</option>
                  {product.sizes.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div className="variation-group">
                <label htmlFor="color">Color:</label>
                <select 
                  id="color" 
                  name="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                >
                  <option value="">Select Color</option>
                  {product.colors.map((color) => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Quantity and CTA Buttons */}
          <div className="product-actions">
            <div className="quantity-group">
              <label htmlFor="quantity">Quantity:</label>
              <input 
                type="number" 
                id="quantity" 
                name="quantity" 
                min="1" 
                max={product.total_units}
                value={quantity}
                onChange={handleQuantityChange}
              />
            </div>
            <div className="action-buttons">
              <button className="add-to-cart" onClick={addToCart}>
                <FaShoppingCart /> Add to Cart
              </button>
              <button className="buy-now" onClick={buyNow}>Buy Now</button>
              <button 
                className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
                onClick={toggleFavorite}
              >
                {isFavorite ? <RiHeartFill /> : <RiHeartLine />}
              </button>
            </div>
          </div>

          {/* Product Description */}
          <div className="product-description">
            <h2>Description</h2>
            <p>{product.product_description}</p>
            {product.material && <p><strong>Material:</strong> {product.material}</p>}
            {product.shipping_weight && (
              <p><strong>Shipping Weight:</strong> {product.shipping_weight} kg</p>
            )}
            <p><strong>Availability:</strong> {product.total_units > 0 
              ? `${product.total_units} in stock` 
              : 'Out of stock'}</p>
          </div>

          {/* Categories */}
          {product.categories && (
            <div className="product-categories">
              <h2>Categories</h2>
              <p>{product.categories.join(' > ')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="customer-reviews-section">
          <h2>Customer Reviews ({product.reviews.length})</h2>
          <div className="reviews-container">
            {product.reviews.map((review) => (
              <div key={review.id} className="review">
                <div className="review-header">
                  <div className="review-rating">{renderStars(review.rating)}</div>
                  <div className="review-author">{review.author}</div>
                  <div className="review-date">{review.date}</div>
                </div>
                <div className="review-text">{review.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const AuthenticatedProductViewPage = withAuth(ProductViewPage);
export default AuthenticatedProductViewPage;