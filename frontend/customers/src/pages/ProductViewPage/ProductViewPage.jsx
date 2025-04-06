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
  console.log('Received productId:', productId); // Check if it's receiving the ID
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

  // Fetch product details with variations
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8082/api/user/fetch-product-details/${productId}`);   
        console.log('Product response:', response.data); // Log the response data

        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to fetch product');
        }

        const productData = response.data.product;
        
        // Process variations to extract available sizes and colorsA
        const sizes = [...new Set(productData.variations.map(v => v.size))];
        const colors = [...new Set(productData.variations.map(v => v.color))];
        
        // Calculate total available units
        const totalUnits = productData.variations.reduce((sum, variation) => sum + variation.units, 0);
        console.log('Total units:', totalUnits); // Log the total units
        setProduct({
          ...productData,
          sizes,
          colors,
          total_units: totalUnits,
          mainImage: productData.image_urls?.[0] || 'https://via.placeholder.com/500',
          images: productData.image_urls || ['https://via.placeholder.com/500']
        });
        
        // Check if product is in favorites
        // const favoriteResponse = await axios.get(`http://localhost:8082/api/user/favorites/check/${productId}`);
        // setIsFavorite(favoriteResponse.data.isFavorite);
        
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

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

  // const toggleFavorite = async () => {
  //   try {
  //     const response = await axios.post(`http://localhost:8082/api/user/favorites/toggle`, {
  //       productId
  //     });
  //     setIsFavorite(response.data.isFavorite);
  //     toast.success(response.data.message);
  //   } catch (err) {
  //     toast.error(err.response?.data?.message || 'Failed to update favorites');
  //   }
  // };

  // const addToCart = async () => {
  //   if (!selectedSize && product?.sizes?.length > 0) {
  //     toast.error('Please select a size');
  //     return;
  //   }
    
  //   if (!selectedColor && product?.colors?.length > 0) {
  //     toast.error('Please select a color');
  //     return;
  //   }

  //   try {
  //     setAddingToCart(true);
  //     const response = await axios.post('http://localhost:8082/api/cart/add', {
  //       productId,
  //       quantity,
  //       size: selectedSize,
  //       color: selectedColor
  //     });
      
  //     toast.success(response.data.message);
  //   } catch (err) {
  //     toast.error(err.response?.data?.message || 'Failed to add to cart');
  //   } finally {
  //     setAddingToCart(false);
  //   }
  // };

  // const buyNow = async () => {
  //   try {
  //     await addToCart();
  //     navigate('/checkout');
  //   } catch (err) {
  //     console.error('Error during buy now:', err);
  //   }
  // };

  const changeImage = (index) => {
    setCurrentImage(index);
  };

  const renderStars = (rating) => {
    // Ensure rating is a number
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
          <div className="product-description" dangerouslySetInnerHTML={{ __html: product.product_description }} />
          <div className="stock-status">
                {product.total_units > 0 ? (
                  <span className="in-stock">{product.total_units} available</span>
                ) : (
                  <span className="out-of-stock">Out of stock</span>
                )}
                {product.total_units > 0 && product.total_units < 10 && (
                    <span className="vp-low-stock">
                      (Only {product.total_units} {product.total_units === 1 ? 'item' : 'items'} left)
                    </span>
                )}
          </div>
          
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
            </div>

            <div className="action-buttons">
              <button 
                className={`add-to-cart ${addingToCart ? 'loading' : ''}`} 
                // onClick={addToCart}
                disabled={product.total_units <= 0 || addingToCart}
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
                disabled={product.total_units <= 0}
              >
                Buy Now
              </button>
              <button 
                className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
                // onClick={toggleFavorite}
              >
                {isFavorite ? <RiHeartFill /> : <RiHeartLine />}
              </button>
              {product.wishlist_count}
            </div>
          </div>

          {/* Product Description */}
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