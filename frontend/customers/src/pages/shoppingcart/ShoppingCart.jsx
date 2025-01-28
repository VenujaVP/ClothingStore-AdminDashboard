//import './ShoppingCart.css';
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState } from 'react';
import './CartPage.css';
import { FaShoppingCart, FaCreditCard, FaShieldAlt } from 'react-icons/fa';

const ShoppingCart = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Classic White T-Shirt",
      seller: "Fashion Store",
      color: "White",
      size: "M",
      quantity: 1,
      price: 29.99,
      image: "tshirt-image-url.jpg"
    },
    // Add more items as needed
  ]);

  const [selectAll, setSelectAll] = useState(false);

  const updateQuantity = (id, newQuantity) => {
    setItems(items.map(item => 
      item.id === id ? {...item, quantity: newQuantity} : item
    ));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-items-section">
          <div className="cart-header">
            <h2><FaShoppingCart /> Cart ({items.length})</h2>
            <label className="select-all">
              <input 
                type="checkbox" 
                checked={selectAll}
                onChange={(e) => setSelectAll(e.target.checked)}
              />
              Select All Items
            </label>
          </div>

          <div className="cart-items">
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="seller">Seller: {item.seller}</p>
                  <div className="item-options">
                    <select defaultValue={item.color}>
                      <option>White</option>
                      <option>Black</option>
                      <option>Gray</option>
                    </select>
                    <select defaultValue={item.size}>
                      <option>S</option>
                      <option>M</option>
                      <option>L</option>
                    </select>
                  </div>
                  <div className="quantity-price">
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <p className="price">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>$5.00</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${(calculateTotal() + 5).toFixed(2)}</span>
            </div>
          </div>

          <button className="checkout-btn">
            Proceed to Checkout
          </button>

          <div className="payment-options">
            <h4><FaCreditCard /> Payment Options</h4>
            <div className="payment-icons">
              <img src="visa-icon.png" alt="Visa" />
              <img src="mastercard-icon.png" alt="Mastercard" />
              <img src="paypal-icon.png" alt="PayPal" />
            </div>
          </div>

          <div className="buyer-protection">
            <FaShieldAlt />
            <p>Buyer Protection: Get full refund if the item is not as described</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;