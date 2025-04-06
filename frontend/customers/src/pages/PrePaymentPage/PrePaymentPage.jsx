/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import withAuth from '../withAuth';
import './PrePaymentPage.css';

const PrePaymentPage = ({ userId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  // Get product details from location state
  useEffect(() => {
    if (!location.state) {
      setError('Product information missing');
      setLoading(false);
      return;
    }

    setOrderDetails(location.state);
    setLoading(false);
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleProceedToPayment = async () => {
    try {
      // Validate shipping info
      if (!shippingInfo.name || !shippingInfo.address || !shippingInfo.phone) {
        throw new Error('Please fill all required shipping information');
      }

      // Create order in backend
      const response = await axios.post('http://localhost:8082/api/orders/create', {
        userId,
        productId: orderDetails.productId,
        variationId: orderDetails.variationId,
        quantity: orderDetails.quantity,
        shippingInfo
      });

      // Navigate to payment page with order ID
      navigate('/payment', { 
        state: { 
          orderId: response.data.orderId,
          totalAmount: orderDetails.totalPrice,
          shippingInfo 
        }
      });

    } catch (err) {
      console.error('Error creating order:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create order');
    }
  };

  if (loading) return <div className="loading">Loading order details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!orderDetails) return <div className="error">No product selected</div>;

  return (
    <div className="pre-payment-container">
      <h1>Review Your Order</h1>
      
      <div className="order-summary">
        <h2>Product Information</h2>
        <div className="product-info">
          <img src={orderDetails.image} alt={orderDetails.productName} />
          <div className="product-details">
            <h3>{orderDetails.productName}</h3>
            <p>Size: {orderDetails.size}</p>
            <p>Color: {orderDetails.color}</p>
            <p>Quantity: {orderDetails.quantity}</p>
            <p className="price">Price: LKR {orderDetails.unitPrice.toFixed(2)}</p>
            <p className="total">Total: LKR {orderDetails.totalPrice.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="shipping-info">
        <h2>Shipping Information</h2>
        <form>
          <div className="form-group">
            <label>Full Name *</label>
            <input 
              type="text" 
              name="name" 
              value={shippingInfo.name} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Address *</label>
            <textarea 
              name="address" 
              value={shippingInfo.address} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>City *</label>
            <input 
              type="text" 
              name="city" 
              value={shippingInfo.city} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Postal Code</label>
            <input 
              type="text" 
              name="postalCode" 
              value={shippingInfo.postalCode} 
              onChange={handleInputChange} 
            />
          </div>
          <div className="form-group">
            <label>Phone Number *</label>
            <input 
              type="tel" 
              name="phone" 
              value={shippingInfo.phone} 
              onChange={handleInputChange} 
              required 
            />
          </div>
        </form>
      </div>

      <div className="payment-actions">
        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          Back to Product
        </button>
        <button 
          className="proceed-button"
          onClick={handleProceedToPayment}
          disabled={!shippingInfo.name || !shippingInfo.address || !shippingInfo.phone}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

const AuthenticatedPrePaymentPage = withAuth(PrePaymentPage);
export default AuthenticatedPrePaymentPage;