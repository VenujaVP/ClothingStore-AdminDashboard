//pages/Viewpage/ProductViewPage.jsx

/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import withAuth from '../withAuth';
import { FaStar, FaRegStar, FaChevronLeft, FaShoppingCart } from 'react-icons/fa';
import { RiHeartLine, RiHeartFill } from 'react-icons/ri';
import './ProductViewPage.css';

const ProductViewPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  
  // Initialize interactive states (not implemented)
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8082/api/user/fetch-product-details/${productId}`);
        
        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to fetch product');
        }

        const productData = response.data.product;
        
        // Process variations
        const sizes = [...new Set(productData.variations?.map(v => v.size) || [])];
        const colors = [...new Set(productData.variations?.map(v => v.color) || [])];
        const totalUnits = productData.variations?.reduce((sum, v) => sum + (v.units || 0), 0) || 0;
        
        setProduct({
          ...productData,
          sizes,
          colors,
          total_units: totalUnits,
          mainImage: productData.image_urls?.[0] || 'https://via.placeholder.com/500',
          images: productData.image_urls || ['https://via.placeholder.com/500']
        });
        
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Initialize interactive functions (not implemented)
  const handleQuantityChange = (e) => {
    const value = Math.max(1, Math.min(100, parseInt(e.target.value) || 1));
    setQuantity(value);
  };

  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, product?.total_units || 100));
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const toggleFavorite = () => {
    console.log('Favorite toggle would be implemented here');
  };

  const addToCart = () => {
    console.log('Add to cart would be implemented here');
  };

  const buyNow = () => {
    console.log('Buy now would be implemented here');
  };

  const changeImage = (index) => {
    setCurrentImage(index);
  };

  const renderStars = (rating) => {
    const numericRating = typeof rating === 'number' ? rating : parseFloat(rating || 0);
    return Array(5).fill(0).map((_, i) => (
      i < Math.floor(numericRating) ? 
        <FaStar key={i} className="star-filled" /> : 
        <FaRegStar key={i} className="star-empty" />
    ));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="back-button">
          <FaChevronLeft /> Go Back
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <p>Product not found</p>
        <button onClick={() => navigate(-1)} className="back-button">
          <FaChevronLeft /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="product-view-page">
      <button onClick={() => navigate(-1)} className="back-button">
        <FaChevronLeft /> Back to Products
      </button>

      <div className="product-view-container">
        {/* Product Images Section */}
        <div className="product-images">
          <img 
            src={product.images[currentImage]} 
            alt={product.product_name} 
            className="main-image" 
          />
          <div className="thumbnail-images">
            {product.images.map((img, index) => (
              <img 
                key={index}
                src={img} 
                alt={`Thumbnail ${index + 1}`}
                className={index === currentImage ? 'thumbnail active' : 'thumbnail'}
                onClick={() => changeImage(index)}
              />
            ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="product-details">
          <h1 className="product-name">{product.product_name}</h1>
          
          <div className="product-meta">
            <div className="product-rating">
              {renderStars(product.rating)} 
              <span className="rating-value">
                ({typeof product.rating === 'number' 
                  ? product.rating.toFixed(1) 
                  : parseFloat(product.rating || 0).toFixed(1)})
              </span>
            </div>
          </div>

          <div className="product-price">
            LKR {product.unit_price?.toFixed(2)}
            {product.original_price && product.original_price > product.unit_price && (
              <span className="original-price">LKR {product.original_price.toFixed(2)}</span>
            )}
          </div>

          {/* Size and Color Selection */}
          <div className="product-variations">
            {product.sizes?.length > 0 && (
              <div className="variation-group">
                <label>Size:</label>
                <div className="size-options">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors?.length > 0 && (
              <div className="variation-group">
                <label>Color:</label>
                <div className="color-options">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quantity and CTA Buttons */}
          <div className="product-actions">
            <div className="quantity-group">
              <label>Quantity:</label>
              <div className="quantity-selector">
                <button onClick={decrementQuantity}>-</button>
                <input 
                  type="number" 
                  min="1" 
                  max={product.total_units}
                  value={quantity}
                  onChange={handleQuantityChange}
                />
                <button onClick={incrementQuantity}>+</button>
              </div>
              <div className="stock-status">
                {product.total_units > 0 ? (
                  <span className="in-stock">{product.total_units} available</span>
                ) : (
                  <span className="out-of-stock">Out of stock</span>
                )}
              </div>
            </div>

            <div className="action-buttons">
              <button 
                className="add-to-cart" 
                onClick={addToCart}
                disabled={product.total_units <= 0}
              >
                <FaShoppingCart /> Add to Cart
              </button>
              <button 
                className="favorite-button"
                onClick={toggleFavorite}
              >
                {isFavorite ? <RiHeartFill /> : <RiHeartLine />}
              </button>
            </div>
          </div>

          {/* Product Description */}
          <div className="product-description-section">
            <h2>Product Details</h2>
            <div className="product-description">
              {product.product_description}
            </div>
            
            <div className="product-specs">
              {product.material && (
                <div className="spec-row">
                  <span className="spec-label">Material:</span>
                  <span className="spec-value">{product.material}</span>
                </div>
              )}
              {product.fabric_type && (
                <div className="spec-row">
                  <span className="spec-label">Fabric Type:</span>
                  <span className="spec-value">{product.fabric_type}</span>
                </div>
              )}
              {product.shipping_weight && (
                <div className="spec-row">
                  <span className="spec-label">Shipping Weight:</span>
                  <span className="spec-value">{product.shipping_weight} kg</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// export default withAuth(ProductViewPage);

const AuthenticatedProductViewPage = withAuth(ProductViewPage);
export default AuthenticatedProductViewPage;