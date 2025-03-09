/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React from 'react';
import './ProductViewPage.css'; // Import the CSS file

const ProductViewPage = () => {
  return (
    <div className="product-view-page">
      <div className="product-view-container">
        {/* Product Images Section */}
        <div className="product-images">
          <img src="product-image-1.jpg" alt="Product" className="main-image" />
          <div className="thumbnail-images">
            <img src="product-image-2.jpg" alt="Thumbnail 1" />
            <img src="product-image-3.jpg" alt="Thumbnail 2" />
          </div>
        </div>

        {/* Product Details Section */}
        <div className="product-details">
          <h1 className="product-name">Product Name</h1>
          <div className="product-rating">
            ★★★★☆ <span className="rating-value">4.2</span>
          </div>
          <div className="product-price">$99.99</div>

          {/* Size and Color Selection */}
          <div className="product-variations">
            <div className="variation-group">
              <label htmlFor="size">Size:</label>
              <select id="size" name="size">
                <option value="1">Small</option>
                <option value="2">Medium</option>
                <option value="3">Large</option>
              </select>
            </div>
            <div className="variation-group">
              <label htmlFor="color">Color:</label>
              <select id="color" name="color">
                <option value="1">Red</option>
                <option value="2">Blue</option>
                <option value="3">Green</option>
              </select>
            </div>
          </div>

          {/* Quantity and CTA Buttons */}
          <div className="product-actions">
            <div className="quantity-group">
              <label htmlFor="quantity">Quantity:</label>
              <input type="number" id="quantity" name="quantity" min="1" defaultValue="1" />
            </div>
            <button className="add-to-cart">Add to Cart</button>
            <button className="buy-now">Buy Now</button>
          </div>

          {/* Product Description */}
          <div className="product-description">
            <h2>Description</h2>
            <p>This is a detailed description of the product. It includes information about the material, fabric type, and other features.</p>
            <p><strong>Material:</strong> Cotton</p>
            <p><strong>Fabric Type:</strong> Woven</p>
            <p><strong>Shipping Weight:</strong> 0.5 kg</p>
            <p><strong>Return Policy:</strong> 30 Days</p>
          </div>

          {/* Categories */}
          <div className="product-categories">
            <h2>Categories</h2>
            <p>Clothing {" > "} Men {" > "} T-Shirts</p>
          </div>
        </div>
      </div>

    {/* Customer Reviews Section */}
    <div className="customer-reviews">
    <h2>Customer Reviews</h2>
    <div className="review">
        <div className="review-rating">★★★★☆</div>
        <div className="review-text">
        &quot;Great product! Fits perfectly.&quot; - John D.
        </div>
    </div>
    <div className="review">
        <div className="review-rating">★★★★★</div>
        <div className="review-text">
        &quot;Love the color and material.&quot; - Jane S.
        </div>
    </div>
    </div>

    </div>
  );
};

export default ProductViewPage;