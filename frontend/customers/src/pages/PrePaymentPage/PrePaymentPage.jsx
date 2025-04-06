/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import withAuth from '../withAuth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './PrePaymentPage.css';

const PrePaymentPage = ({ userId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Sri Lanka',
    isDefault: false
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Load order data from navigation state
  useEffect(() => {
    if (!location.state) {
      toast.error('No order information found');
      navigate('/');
      return;
    }

    setOrder(location.state);
    setLoading(false);
  }, [location, navigate]);

  // Fetch user addresses, delivery and payment options
//   useEffect(() => {
//     if (!userId) return;

//     const fetchData = async () => {
//       try {
//         // Fetch user addresses
//         const addressesRes = await axios.get(`http://localhost:8082/api/user/addresses/${userId}`);
//         setAddresses(addressesRes.data.addresses || []);
        
//         // Set default address if available
//         const defaultAddress = addressesRes.data.addresses.find(addr => addr.isDefault);
//         if (defaultAddress) setSelectedAddress(defaultAddress._id);

//         // Fetch delivery options
//         const deliveryRes = await axios.get('http://localhost:8082/api/delivery-options');
//         setDeliveryOptions(deliveryRes.data.deliveryOptions || []);
//         if (deliveryRes.data.deliveryOptions?.length > 0) {
//           setSelectedDelivery(deliveryRes.data.deliveryOptions[0]._id);
//         }

//         // Fetch payment methods
//         const paymentRes = await axios.get('http://localhost:8082/api/payment-methods');
//         setPaymentMethods(paymentRes.data.paymentMethods || []);
//         if (paymentRes.data.paymentMethods?.length > 0) {
//           setSelectedPayment(paymentRes.data.paymentMethods[0]._id);
//         }
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setError(err.response?.data?.message || err.message || 'Failed to load checkout data');
//       }
//     };

//     fetchData();
//   }, [userId]);

  const handleAddressChange = (e) => {
    setSelectedAddress(e.target.value);
  };

  const handleDeliveryChange = (e) => {
    setSelectedDelivery(e.target.value);
  };

  const handlePaymentChange = (e) => {
    setSelectedPayment(e.target.value);
  };

  const handleNewAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const saveNewAddress = async () => {
    try {
      if (!newAddress.street || !newAddress.city || !newAddress.postalCode) {
        toast.error('Please fill all required address fields');
        return;
      }

      const response = await axios.post(`http://localhost:8082/api/user/addresses/${userId}`, newAddress);
      setAddresses([...addresses, response.data.address]);
      setSelectedAddress(response.data.address._id);
      setShowAddressForm(false);
      toast.success('Address saved successfully');
    } catch (err) {
      console.error('Error saving address:', err);
      toast.error(err.response?.data?.message || 'Failed to save address');
    }
  };

  const calculateTotal = () => {
    if (!order || !selectedDelivery) return 0;
    
    const deliveryOption = deliveryOptions.find(opt => opt._id === selectedDelivery);
    const deliveryCost = deliveryOption ? Number(deliveryOption.cost) : 0;
    const unitPrice = Number(order.unitPrice || 0);
    
    return (unitPrice * order.quantity + deliveryCost).toFixed(2);
  };

  const placeOrder = async () => {
    if (!selectedAddress || !selectedDelivery || !selectedPayment) {
      toast.error('Please complete all required fields');
      return;
    }

    try {
      setProcessing(true);
      
      const orderData = {
        userId,
        productId: order.productId,
        variationId: order.variationId,
        quantity: order.quantity,
        size: order.size,
        color: order.color,
        unitPrice: order.unitPrice,
        totalPrice: calculateTotal(),
        deliveryOptionId: selectedDelivery,
        paymentMethodId: selectedPayment,
        shippingAddressId: selectedAddress,
        status: 'pending'
      };

      const response = await axios.post('http://localhost:8082/api/orders', orderData);
      
      if (response.data.success) {
        toast.success('Order placed successfully!');
        navigate('/order-confirmation', { state: { orderId: response.data.order._id } });
      } else {
        throw new Error(response.data.message || 'Failed to place order');
      }
    } catch (err) {
      console.error('Error placing order:', err);
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading order information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="error-container">
        <p>No order information found</p>
        <button onClick={() => navigate('/')} className="back-button">
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="pre-payment-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <div className="checkout-steps">
            <div className="step active">1. Shipping</div>
            <div className="step">2. Payment</div>
            <div className="step">3. Confirmation</div>
          </div>
        </div>

        <div className="checkout-content">
          {/* Order Summary Section */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="product-info">
            <img src={order.image} alt={order.productName} className="product-image" />
                <div className="product-details">
                    <h3>{order.productName}</h3>
                    <p>Size: {order.size}</p>
                    <p>Color: {order.color}</p>
                    <p>Quantity: {order.quantity}</p>
                    <p className="price">
                    LKR {Number(order.unitPrice || 0).toFixed(2)} × {order.quantity}
                    </p>
                </div>
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>LKR {order.totalPrice.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery:</span>
                <span>
                  {selectedDelivery ? 
                    `LKR ${deliveryOptions.find(d => d._id === selectedDelivery)?.cost.toFixed(2) || '0.00'}` : 
                    'Select delivery option'}
                </span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>LKR {calculateTotal()}</span>
              </div>
            </div>
          </div>

          {/* Shipping and Payment Sections */}
          <div className="checkout-sections">
            {/* Shipping Address Section */}
            <section className="checkout-section">
              <h2>Shipping Address</h2>
              {addresses.length > 0 ? (
                <div className="address-options">
                  {addresses.map(address => (
                    <div key={address._id} className="address-option">
                      <input
                        type="radio"
                        id={`address-${address._id}`}
                        name="address"
                        value={address._id}
                        checked={selectedAddress === address._id}
                        onChange={handleAddressChange}
                      />
                      <label htmlFor={`address-${address._id}`}>
                        <div className="address-details">
                          <p>{address.street}</p>
                          <p>{address.city}, {address.state}</p>
                          <p>{address.postalCode}, {address.country}</p>
                          {address.isDefault && <span className="default-badge">Default</span>}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No saved addresses found.</p>
              )}

              <button 
                className="add-address-btn"
                onClick={() => setShowAddressForm(!showAddressForm)}
              >
                {showAddressForm ? 'Cancel' : '+ Add New Address'}
              </button>

              {showAddressForm && (
                <div className="new-address-form">
                  <div className="form-group">
                    <label>Street Address*</label>
                    <input
                      type="text"
                      name="street"
                      value={newAddress.street}
                      onChange={handleNewAddressChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>City*</label>
                    <input
                      type="text"
                      name="city"
                      value={newAddress.city}
                      onChange={handleNewAddressChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>State/Province</label>
                    <input
                      type="text"
                      name="state"
                      value={newAddress.state}
                      onChange={handleNewAddressChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Postal Code*</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={newAddress.postalCode}
                      onChange={handleNewAddressChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      name="country"
                      value={newAddress.country}
                      onChange={handleNewAddressChange}
                      disabled
                    />
                  </div>
                  <div className="form-group checkbox">
                    <input
                      type="checkbox"
                      id="defaultAddress"
                      name="isDefault"
                      checked={newAddress.isDefault}
                      onChange={handleNewAddressChange}
                    />
                    <label htmlFor="defaultAddress">Set as default address</label>
                  </div>
                  <button className="save-address-btn" onClick={saveNewAddress}>
                    Save Address
                  </button>
                </div>
              )}
            </section>

            {/* Delivery Options Section */}
            <section className="checkout-section">
              <h2>Delivery Options</h2>
              {deliveryOptions.length > 0 ? (
                <div className="delivery-options">
                  {deliveryOptions.map(option => (
                    <div key={option._id} className="delivery-option">
                      <input
                        type="radio"
                        id={`delivery-${option._id}`}
                        name="delivery"
                        value={option._id}
                        checked={selectedDelivery === option._id}
                        onChange={handleDeliveryChange}
                      />
                      <label htmlFor={`delivery-${option._id}`}>
                        <div className="delivery-details">
                          <span className="delivery-name">{option.name}</span>
                          <span className="delivery-cost">LKR {option.cost.toFixed(2)}</span>
                          <span className="delivery-time">{option.estimatedDays} business days</span>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No delivery options available.</p>
              )}
            </section>

            {/* Payment Method Section */}
            <section className="checkout-section">
              <h2>Payment Method</h2>
              {paymentMethods.length > 0 ? (
                <div className="payment-options">
                  {paymentMethods.map(method => (
                    <div key={method._id} className="payment-option">
                      <input
                        type="radio"
                        id={`payment-${method._id}`}
                        name="payment"
                        value={method._id}
                        checked={selectedPayment === method._id}
                        onChange={handlePaymentChange}
                      />
                      <label htmlFor={`payment-${method._id}`}>
                        <div className="payment-details">
                          <span className="payment-name">{method.name}</span>
                          {method.description && (
                            <span className="payment-desc">{method.description}</span>
                          )}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No payment methods available.</p>
              )}
            </section>

            {/* Place Order Button */}
            <div className="place-order-section">
              <button 
                className="place-order-btn"
                onClick={placeOrder}
                disabled={!selectedAddress || !selectedDelivery || !selectedPayment || processing}
              >
                {processing ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthenticatedPrePaymentPage = withAuth(PrePaymentPage);
export default AuthenticatedPrePaymentPage;