// pages/PrePaymentPage/PrePaymentPage.jsx

/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import withAuth from '../withAuth';
import { FaChevronLeft, FaShoppingCart, FaTimes, FaArrowRight, FaMapMarkerAlt, FaEdit, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './PrePaymentPage.css';

const PrePaymentPage = ({ userId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    contact_name: '',
    mobile_number: '',
    street_address: '',
    apt_suite_unit: '',
    province: '',
    district: '',
    zip_code: '',
    is_default: false
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Province and district data
  const provinces = [
    'Western Province',
    'Central Province',
    'Southern Province',
    'Northern Province',
    'Eastern Province',
    'North Western Province',
    'North Central Province',
    'Uva Province',
    'Sabaragamuwa Province',
  ];

  const districts = {
    'Western Province': ['Colombo', 'Gampaha', 'Kalutara'],
    'Central Province': ['Kandy', 'Matale', 'Nuwara Eliya'],
    'Southern Province': ['Galle', 'Matara', 'Hambantota'],
    'Northern Province': ['Jaffna', 'Kilinochchi', 'Mannar', 'Mullaitivu', 'Vavuniya'],
    'Eastern Province': ['Trincomalee', 'Batticaloa', 'Ampara'],
    'North Western Province': ['Kurunegala', 'Puttalam'],
    'North Central Province': ['Anuradhapura', 'Polonnaruwa'],
    'Uva Province': ['Badulla', 'Monaragala'],
    'Sabaragamuwa Province': ['Ratnapura', 'Kegalle'],
  };

  // Initial setup - get cart items and other necessary data
  useEffect(() => {
    // Check if location.state exists and has either cart or orderData
    if (!location.state) {
      navigate('/cart');
      return;
    }
    
    // Handle data coming from either cart page or buy now button
    if (location.state.cart) {
      setOrderItems(location.state.cart);
    } else {
      navigate('/cart');
      return;
    }
    
    // Existing code for delivery options and payment methods
    const fetchDeliveryOptions = async () => {
      try {
        const response = await axios.get('http://localhost:8082/api/delivery-options');
        setDeliveryOptions(response.data.deliveryOptions);
        if (response.data.deliveryOptions.length > 0) {
          setSelectedDelivery(response.data.deliveryOptions[0]._id);
        }
      } catch (err) {
        console.error('Error fetching delivery options:', err);
        toast.error('Failed to load delivery options');
      }
    };

    const fetchPaymentMethods = async () => {
      try {
        const response = await axios.get('http://localhost:8082/api/payment-methods');
        setPaymentMethods(response.data.paymentMethods);
        if (response.data.paymentMethods.length > 0) {
          setSelectedPayment(response.data.paymentMethods[0]._id);
        }
      } catch (err) {
        console.error('Error fetching payment methods:', err);
        toast.error('Failed to load payment methods');
      }
    };

    fetchDeliveryOptions();
    fetchPaymentMethods();
    setLoading(false);
  }, [location, navigate]);

  // Fetch user addresses
  useEffect(() => {
    if (userId) {
      const fetchAddresses = async () => {
        try {
          const response = await axios.get(`http://localhost:8082/api/user/addresses/${userId}`);
          if (response.data.success) {
            setAddresses(response.data.addresses);
            
            const defaultAddress = response.data.addresses.find(addr => addr.is_default) || response.data.addresses[0];
            if (defaultAddress) {
              setSelectedAddress(defaultAddress.address_id.toString());
            }
          }
        } catch (err) {
          console.error('Error fetching addresses:', err);
          toast.error('Failed to load your saved addresses');
        }
      };
      
      fetchAddresses();
    } else if (!loading) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [userId, navigate, loading]);

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
    setNewAddress({
      ...newAddress,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const saveNewAddress = async () => {
    if (!newAddress.contact_name || !newAddress.mobile_number || 
        !newAddress.street_address || !newAddress.province || 
        !newAddress.district || !newAddress.zip_code) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8082/api/user/shipping-address', {
        customerID: userId,
        contact_name: newAddress.contact_name,
        mobile_number: newAddress.mobile_number,
        street_address: newAddress.street_address,
        apt_suite_unit: newAddress.apt_suite_unit,
        province: newAddress.province,
        district: newAddress.district,
        zip_code: newAddress.zip_code,
        is_default: newAddress.is_default
      });

      if (response.data.success) {
        toast.success('Address added successfully!');
        
        // Update addresses list and select the new address
        const newAddressId = response.data.addressId;
        const updatedAddress = {
          address_id: newAddressId,
          contact_name: newAddress.contact_name,
          mobile_number: newAddress.mobile_number,
          street_address: newAddress.street_address,
          apt_suite_unit: newAddress.apt_suite_unit,
          province: newAddress.province,
          district: newAddress.district,
          zip_code: newAddress.zip_code,
          is_default: newAddress.is_default
        };
        
        setAddresses([...addresses, updatedAddress]);
        setSelectedAddress(newAddressId.toString());
        
        // Reset form
        setNewAddress({
          contact_name: '',
          mobile_number: '',
          street_address: '',
          apt_suite_unit: '',
          province: '',
          district: '',
          zip_code: '',
          is_default: false
        });
        setShowAddressForm(false);
      } else {
        throw new Error(response.data.message || 'Failed to add address');
      }
    } catch (err) {
      console.error('Error saving address:', err);
      toast.error(err.response?.data?.message || 'Failed to save address');
    }
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const deliveryOption = deliveryOptions.find(opt => opt._id === selectedDelivery);
    const deliveryCost = deliveryOption ? Number(deliveryOption.cost) : 0;
    return (subtotal + deliveryCost).toFixed(2);
  };

  const continueToPayment = () => {
    if (!selectedAddress || !selectedDelivery || !selectedPayment) {
      toast.error('Please select shipping address, delivery method, and payment method');
      return;
    }
    
    placeOrder();
  };

  const placeOrder = async () => {
    setProcessing(true);
    try {
      // Here you would send the order to your backend
      // Wait for processing (simulated)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to success page or payment gateway
      navigate('/order-confirmation', {
        state: {
          orderItems,
          address: getSelectedAddressObject(),
          deliveryMethod: deliveryOptions.find(opt => opt._id === selectedDelivery),
          paymentMethod: paymentMethods.find(opt => opt._id === selectedPayment),
          total: calculateTotal()
        }
      });
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place your order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const getSelectedAddressObject = () => {
    if (!addresses || addresses.length === 0) return null;
    return addresses.find(addr => addr.address_id.toString() === selectedAddress);
  };

  const confirmAddressSelection = () => {
    setShowAddressModal(false);
  };

  const navigateToAddressForm = () => {
    navigate('/user-shipping-address-form');
  };

  if (loading) {
    return <div className="pre-payment-loading">Loading checkout information...</div>;
  }

  if (!orderItems || orderItems.length === 0) {
    return <div className="pre-payment-error">No items in your cart. Please add items to proceed.</div>;
  }

  const selectedAddressObj = getSelectedAddressObject();

  return (
    <div className="pre-payment-page">
      {/* Address Selection Modal */}
      {showAddressModal && (
        <div className="modal-overlay">
          <div className="address-selection-modal">
            <div className="modal-header">
              <h2>Select Delivery Address</h2>
              <button className="close-modal" onClick={() => setShowAddressModal(false)}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-content">
              <div className="address-grid">
                {addresses.map(address => (
                  <div 
                    key={address.address_id} 
                    className={`address-card ${selectedAddress === address.address_id.toString() ? 'selected' : ''}`}
                    onClick={() => setSelectedAddress(address.address_id.toString())}
                  >
                    <div className="address-card-content">
                      {address.is_default && <span className="default-badge">Default</span>}
                      {selectedAddress === address.address_id.toString() && (
                        <span className="selected-check"><FaCheck /></span>
                      )}
                      <p className="address-name">{address.contact_name}</p>
                      <p className="address-phone">{address.mobile_number}</p>
                      <p>{address.street_address}</p>
                      {address.apt_suite_unit && <p>{address.apt_suite_unit}</p>}
                      <p>{address.district}, {address.province}</p>
                      <p>{address.zip_code}</p>
                    </div>
                  </div>
                ))}
                
                <div className="add-address-card" onClick={navigateToAddressForm}>
                  <FaMapMarkerAlt />
                  <p>Add New Address</p>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="confirm-address-btn" onClick={confirmAddressSelection}>
                Confirm Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address Form Modal */}
      {showAddressForm && (
        <div className="modal-overlay">
          <div className="address-modal">
            <div className="modal-header">
              <h2>Add New Address</h2>
              <button className="close-modal" onClick={() => setShowAddressForm(false)}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-content">
              <div className="form-group">
                <label>Contact Name *</label>
                <input 
                  type="text" 
                  name="contact_name" 
                  value={newAddress.contact_name} 
                  onChange={handleNewAddressChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Mobile Number *</label>
                <div className="input-with-prefix">
                  <span className="prefix">+94</span>
                  <input 
                    type="tel" 
                    name="mobile_number" 
                    value={newAddress.mobile_number} 
                    onChange={handleNewAddressChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Street Address *</label>
                <input 
                  type="text" 
                  name="street_address" 
                  value={newAddress.street_address} 
                  onChange={handleNewAddressChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Apt, Suite, Unit (optional)</label>
                <input 
                  type="text" 
                  name="apt_suite_unit" 
                  value={newAddress.apt_suite_unit} 
                  onChange={handleNewAddressChange}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Province *</label>
                  <select 
                    name="province" 
                    value={newAddress.province} 
                    onChange={handleNewAddressChange}
                    required
                  >
                    <option value="">Select Province</option>
                    {provinces.map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>District *</label>
                  <select 
                    name="district" 
                    value={newAddress.district}
                    onChange={handleNewAddressChange}
                    required
                    disabled={!newAddress.province}
                  >
                    <option value="">Select District</option>
                    {newAddress.province && districts[newAddress.province].map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>ZIP Code *</label>
                <input 
                  type="text" 
                  name="zip_code" 
                  value={newAddress.zip_code} 
                  onChange={handleNewAddressChange}
                  required
                />
              </div>
              
              <div className="form-group checkbox">
                <input 
                  type="checkbox" 
                  id="is_default" 
                  name="is_default" 
                  checked={newAddress.is_default} 
                  onChange={handleNewAddressChange}
                />
                <label htmlFor="is_default">Set as default shipping address</label>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="save-address-btn" onClick={saveNewAddress}>Save Address</button>
            </div>
          </div>
        </div>
      )}

      <div className="checkout-container">
        <div className="checkout-header">
          <button className="back-button" onClick={() => navigate('/cart')}>
            <FaChevronLeft /> Back to Cart
          </button>
          <h1>Checkout</h1>
          <div className="checkout-steps">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>Shipping</div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>Payment</div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>Confirmation</div>
          </div>
        </div>

        <div className="checkout-content">
          {/* Order Summary Section */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="order-items">
              {orderItems.map((item) => (
                <div key={item.cartItemId} className="order-item">
                  <div className="item-image">
                    <img 
                      src={item.imageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='12' fill='%23999' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E"}
                      alt={item.productName} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='12' fill='%23999' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div className="item-quantity">{item.quantity}</div>
                  </div>
                  <div className="item-details">
                    <h3>{item.productName}</h3>
                    <p>Size: {item.size} | Color: {item.color}</p>
                    <p className="item-price">LKR {item.unitPrice.toFixed(2)} × {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>LKR {calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>
                  {selectedDelivery 
                    ? `LKR ${deliveryOptions.find(opt => opt._id === selectedDelivery)?.cost.toFixed(2) || '0.00'}`
                    : 'Not selected'
                  }
                </span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>LKR {calculateTotal()}</span>
              </div>
            </div>
          </div>

          {/* Checkout Sections */}
          <div className="checkout-sections">
            {/* Shipping Address Section - Updated */}
            <section className="checkout-section">
              <h2>Shipping Address</h2>
              
              {/* Display Selected Address */}
              {selectedAddressObj ? (
                <div className="selected-address">
                  {selectedAddressObj.is_default && 
                    <span className="selected-address-badge">Default</span>
                  }
                  <div className="address-details">
                    <p><strong>{selectedAddressObj.contact_name}</strong> • {selectedAddressObj.mobile_number}</p>
                    <p>{selectedAddressObj.street_address}</p>
                    {selectedAddressObj.apt_suite_unit && <p>{selectedAddressObj.apt_suite_unit}</p>}
                    <p>{selectedAddressObj.district}, {selectedAddressObj.province}</p>
                    <p>{selectedAddressObj.zip_code}</p>
                  </div>
                  <div className="address-actions">
                    <button 
                      className="change-address-btn"
                      onClick={() => setShowAddressModal(true)}
                    >
                      <FaEdit /> Change Address
                    </button>
                    <button 
                      className="add-address-btn"
                      onClick={navigateToAddressForm}
                    >
                      <FaMapMarkerAlt /> Add New Address
                    </button>
                  </div>
                </div>
              ) : (
                <div className="no-address-container">
                  <p className="no-address">No shipping addresses found.</p>
                  <button 
                    className="add-address-btn primary"
                    onClick={navigateToAddressForm}
                  >
                    <FaMapMarkerAlt /> Add New Address
                  </button>
                </div>
              )}
            </section>

            {/* Compact Delivery & Payment Sections */}
            <div className="compact-sections-container">
              {/* Delivery Options Section */}
              <section className="checkout-section compact-section">
                <h2>Delivery Method</h2>
                <div className="delivery-options compact">
                  {deliveryOptions.map(option => (
                    <div key={option._id} className="delivery-option compact">
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
                          <span className="delivery-time">({option.estimatedDays} days)</span>
                          <span className="delivery-cost">LKR {option.cost.toFixed(2)}</span>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </section>

              {/* Payment Method Section */}
              <section className="checkout-section compact-section">
                <h2>Payment Method</h2>
                <div className="payment-options compact">
                  {paymentMethods.map(method => (
                    <div key={method._id} className="payment-option compact">
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
                          <span className="payment-desc">{method.description}</span>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Continue Button */}
            <div className="checkout-actions">
              <button 
                className="continue-button"
                onClick={continueToPayment}
                disabled={!selectedAddress || !selectedDelivery || !selectedPayment || processing}
              >
                {processing ? (
                  <>Processing <span className="spinner"></span></>
                ) : (
                  <>
                    Place Order <FaArrowRight />
                  </>
                )}
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