//pages/Viewpage/ProductViewPage.jsx

/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import withAuth from '../withAuth';
import { RiHeartLine, RiHeartFill } from 'react-icons/ri';
import { FaShoppingCart, FaStar, FaRegStar, FaChevronLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProductViewPage.css';

const ProductViewPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [currentStock, setCurrentStock] = useState(0);
  const [selectedVariation, setSelectedVariation] = useState(null);

  // Fetch product details with variations
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8082/api/user/fetch-product-details/${productId}`);
        
        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to fetch product');
        }

        const productData = response.data.product;
        const sizes = [...new Set(productData.variations.map(v => v.size))];
        const colors = [...new Set(productData.variations.map(v => v.color))];
        
        setProduct({
          ...productData,
          sizes,
          colors,
          mainImage: productData.image_urls?.[0] || 'https://via.placeholder.com/500',
          images: productData.image_urls || ['https://via.placeholder.com/500']
        });

        // Initialize with first available variation if exists
        if (productData.variations.length > 0) {
          const availableVariation = productData.variations.find(v => v.in_stock);
          if (availableVariation) {
            setSelectedSize(availableVariation.size);
            setSelectedColor(availableVariation.color);
          }
        }
        
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  // Update current stock when size or color changes
  useEffect(() => {
    if (!product || !product.variations) return;

    const variation = product.variations.find(v => 
      v.size === selectedSize && v.color === selectedColor
    );

    setSelectedVariation(variation);
    setCurrentStock(variation?.quantity || 0);
    
    // Reset quantity if exceeds new stock limit
    if (variation && quantity > variation.quantity) {
      setQuantity(Math.max(1, variation.quantity));
    }
  }, [selectedSize, selectedColor, product, quantity]);

  const handleQuantityChange = (e) => {
    const value = Math.max(1, Math.min(currentStock, parseInt(e.target.value) || 1));
    setQuantity(value);
  };

  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, currentStock));
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
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

  const getAvailableText = () => {
    if (!selectedVariation) return 'Select options to check availability';
    if (currentStock <= 0) return 'Out of stock';
    if (currentStock < 5) return `Only ${currentStock} left in stock!`;
    return 'In stock';
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
          <div className="product-description" dangerouslySetInnerHTML={{ __html: product.product_description }} />
          
          <div className="product-meta">
            <div className="product-rating">
              {renderStars(product.rating)} 
              <span className="rating-value">
                ({typeof product.rating === 'number' 
                  ? product.rating.toFixed(1) 
                  : parseFloat(product.rating || 0).toFixed(1)})
              </span>
              <span className="review-count">{product.review_count || 0} reviews</span>
            </div>
          </div>

          <div className="product-price">
            LKR {Number(product.unit_price)?.toFixed(2)}
            {product.original_price && product.original_price > product.unit_price && (
              <span className="original-price">LKR {Number(product.original_price).toFixed(2)}</span>
            )}
          </div>

          {/* Size and Color Selection */}
          <div className="product-variations">
            {product.sizes?.length > 0 && (
              <div className="variation-group">
                <label>Size:</label>
                <div className="size-options">
                  {product.sizes.map((size) => {
                    const hasStock = product.variations.some(v => 
                      v.size === size && 
                      (selectedColor ? v.color === selectedColor : true) && 
                      v.in_stock
                    );
                    return (
                      <button
                        key={size}
                        className={`size-option ${selectedSize === size ? 'selected' : ''} ${!hasStock ? 'out-of-stock' : ''}`}
                        onClick={() => setSelectedSize(size)}
                        disabled={!hasStock}
                        title={!hasStock ? 'Out of stock' : ''}
                      >
                        {size}
                        {!hasStock && <span className="oos-badge">X</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {product.colors?.length > 0 && (
              <div className="variation-group">
                <label>Color:</label>
                <div className="color-options">
                  {product.colors.map((color) => {
                    const hasStock = product.variations.some(v => 
                      v.color === color && 
                      (selectedSize ? v.size === selectedSize : true) && 
                      v.in_stock
                    );
                    return (
                      <button
                        key={color}
                        className={`color-option ${selectedColor === color ? 'selected' : ''} ${!hasStock ? 'out-of-stock' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                        disabled={!hasStock}
                        title={!hasStock ? 'Out of stock' : color}
                      >
                        {!hasStock && <span className="oos-badge">X</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div className="stock-status">
            <span className={`availability ${currentStock <= 0 ? 'out-of-stock' : 'in-stock'}`}>
              {getAvailableText()}
            </span>
          </div>

          {/* Quantity and CTA Buttons */}
          <div className="product-actions">
            {selectedVariation && currentStock > 0 && (
              <div className="quantity-group">
                <label>Quantity:</label>
                <div className="quantity-selector">
                  <button 
                    onClick={decrementQuantity} 
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    min="1" 
                    max={currentStock}
                    value={quantity}
                    onChange={handleQuantityChange}
                    disabled={currentStock <= 0}
                  />
                  <button 
                    onClick={incrementQuantity} 
                    disabled={quantity >= currentStock}
                  >
                    +
                  </button>
                </div>
                {currentStock > 0 && (
                  <div className="max-quantity-note">
                    (Max: {currentStock})
                  </div>
                )}
              </div>
            )}

            <div className="action-buttons">
              <button 
                className={`add-to-cart ${addingToCart ? 'loading' : ''}`} 
                // onClick={addToCart}
                disabled={currentStock <= 0 || addingToCart || !selectedVariation}
              >
                {addingToCart ? 'Adding...' : (
                  <>
                    <FaShoppingCart /> Add to Cart
                  </>
                )}
              </button>
              <button 
                className="buy-now" 
                // onClick={buyNow}
                disabled={currentStock <= 0 || !selectedVariation}
              >
                Buy Now
              </button>
              
              <button 
                className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
                // onClick={toggleFavorite}
              >
                {isFavorite ? <RiHeartFill /> : <RiHeartLine />}
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="product-description-section">
            <h2>Product Details</h2>            
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
              {product.return_policy && (
                <div className="spec-row">
                  <span className="spec-label">Return Policy:</span>
                  <span className="spec-value">{product.return_policy}</span>
                </div>
              )}
            </div>
          </div>

          {/* Categories */}
          {product.Category1 && (
            <div className="product-categories">
              <h2>Categories</h2>
              <div className="category-breadcrumbs">
                {[product.Category1, product.Category2, product.Category3]
                  .filter(Boolean)
                  .map((category, index) => (
                    <React.Fragment key={category}>
                      {index > 0 && <span className="breadcrumb-separator">/</span>}
                      <span className="breadcrumb-item">{category}</span>
                    </React.Fragment>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="customer-reviews-section">
        <h2>Customer Reviews {product.reviews?.length > 0 && `(${product.reviews.length})`}</h2>
        
        {product.reviews?.length > 0 ? (
          <div className="reviews-container">
            {product.reviews.map((review) => (
              <div key={review._id} className="review">
                <div className="review-header">
                  <div className="review-author">{review.userName || 'Anonymous'}</div>
                  <div className="review-rating">{renderStars(review.rating)}</div>
                  <div className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <h4 className="review-title">{review.title}</h4>
                <div className="review-text">{review.comment}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
        )}
      </div>
    </div>
  );
};

const AuthenticatedProductViewPage = withAuth(ProductViewPage);
export default AuthenticatedProductViewPage;