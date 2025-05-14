/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import withAuth from '../withAuth';
import { FaChevronLeft, FaShoppingCart, FaTimes, FaArrowRight, FaMapMarkerAlt, FaEdit } from 'react-icons/fa';
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
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation
  const [showAllAddresses, setShowAllAddresses] = useState(false);

  useEffect(() => {
    if (!location.state) {
      toast.error('No order information found');
      navigate('/');
      return;
    }

    const items = Array.isArray(location.state) ? location.state : [location.state];
    setOrderItems(items);
    setLoading(false);
  }, [location, navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        toast.error('User authentication required');
        navigate('/login');
        return;
      }

      try {
        const addressesResponse = await axios.get(`http://localhost:8082/api/user/addresses/${userId}`);
        
        if (addressesResponse.data.success) {
          setAddresses(addressesResponse.data.addresses || []);
          
          const defaultAddress = addressesResponse.data.addresses.find(address => address.is_default);
          if (defaultAddress) {
            setSelectedAddress(defaultAddress.address_id.toString());
          } else if (addressesResponse.data.addresses.length > 0) {
            setSelectedAddress(addressesResponse.data.addresses[0].address_id.toString());
          }
        } else {
          console.error('Failed to fetch addresses:', addressesResponse.data.message);
        }
        
        const mockDeliveryOptions = [
          { _id: 'standard', name: 'Standard Delivery', cost: 350, estimatedDays: '3-5' },
          { _id: 'express', name: 'Express Delivery', cost: 650, estimatedDays: '1-2' }
        ];
        setDeliveryOptions(mockDeliveryOptions);
        setSelectedDelivery('standard');
        
        const mockPaymentMethods = [
          { _id: 'cod', name: 'Cash on Delivery', description: 'Pay when your order arrives' },
          { _id: 'card', name: 'Credit/Debit Card', description: 'Secure online payment' }
        ];
        setPaymentMethods(mockPaymentMethods);
        setSelectedPayment('cod');
        
      } catch (err) {
        console.error('Error fetching user data:', err);
        toast.error('Failed to load user data. Please try again.');
      }
    };

    if (!loading) {
      fetchUserData();
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
    setNewAddress(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const saveNewAddress = async () => {
    if (!newAddress.contact_name || !newAddress.mobile_number || 
        !newAddress.street_address || !newAddress.province || 
        !newAddress.district || !newAddress.zip_code) {
      toast.error('Please fill all required fields');
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
        toast.success('Address added successfully');
        
        const addressesResponse = await axios.get(`http://localhost:8082/api/user/addresses/${userId}`);
        if (addressesResponse.data.success) {
          setAddresses(addressesResponse.data.addresses);
          setSelectedAddress(response.data.address_id.toString());
        }
        
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
    if (!selectedAddress) {
      toast.error('Please select a shipping address');
      return;
    }

    if (!selectedDelivery) {
      toast.error('Please select a delivery method');
      return;
    }
    
    setCurrentStep(2);
    placeOrder();
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
        items: orderItems.map(item => ({
          productId: item.productId,
          variationId: item.variationId,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        })),
        deliveryOptionId: selectedDelivery,
        paymentMethodId: selectedPayment,
        shippingAddressId: selectedAddress,
        totalAmount: calculateTotal(),
        status: 'pending'
      };

      setTimeout(() => {
        toast.success('Order placed successfully!');
        navigate('/order-confirmation', { 
          state: { 
            orderId: 'ORD' + Math.floor(Math.random() * 1000000),
            orderItems,
            total: calculateTotal(),
            deliveryOption: deliveryOptions.find(opt => opt._id === selectedDelivery)
          } 
        });
        setProcessing(false);
      }, 1500);
      
    } catch (err) {
      console.error('Error placing order:', err);
      toast.error(err.response?.data?.message || 'Failed to place order');
      setProcessing(false);
    }
  };

  const getSelectedAddressObject = () => {
    if (!addresses || addresses.length === 0) return null;
    return addresses.find(addr => addr.address_id.toString() === selectedAddress);
  };

  const renderShippingAddressSection = () => {
    if (!addresses || addresses.length === 0) {
      return (
        <section className="checkout-section">
          <h2>Shipping Address</h2>
          <p className="no-address">No saved addresses found.</p>
          <button 
            className="add-address-btn"
            onClick={() => setShowAddressForm(true)}
          >
            <FaMapMarkerAlt /> Add New Address
          </button>
        </section>
      );
    }

    const selectedAddressObj = getSelectedAddressObject();

    return (
      <section className="checkout-section">
        <h2>Shipping Address</h2>
        
        {selectedAddressObj && !showAllAddresses && (
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
                onClick={() => setShowAllAddresses(true)}
              >
                <FaEdit /> Change Address
              </button>
              <button 
                className="add-address-btn"
                onClick={() => setShowAddressForm(true)}
              >
                <FaMapMarkerAlt /> Add New Address
              </button>
            </div>
          </div>
        )}

        {showAllAddresses && (
          <>
            <div className="address-options">
              {addresses.map(address => (
                <div key={address.address_id} className="address-option">
                  <input
                    type="radio"
                    id={`address-${address.address_id}`}
                    name="address"
                    value={address.address_id}
                    checked={selectedAddress === address.address_id.toString()}
                    onChange={handleAddressChange}
                  />
                  <label htmlFor={`address-${address.address_id}`}>
                    <div className="address-details">
                      <p><strong>{address.contact_name}</strong> • {address.mobile_number}</p>
                      <p>{address.street_address}</p>
                      {address.apt_suite_unit && <p>{address.apt_suite_unit}</p>}
                      <p>{address.district}, {address.province}</p>
                      <p>{address.zip_code}</p>
                      {address.is_default && <span className="default-badge">Default</span>}
                    </div>
                  </label>
                </div>
              ))}
            </div>

            <div className="address-actions">
              <button 
                className="confirm-address-btn"
                onClick={() => setShowAllAddresses(false)}
              >
                Confirm Address
              </button>
              <button 
                className="add-address-btn"
                onClick={() => setShowAddressForm(true)}
              >
                <FaMapMarkerAlt /> Add New Address
              </button>
            </div>
          </>
        )}
      </section>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading order information...</p>
      </div>
    );
  }

  if (!orderItems || orderItems.length === 0) {
    return (
      <div className="error-container">
        <p>No order items found</p>
        <button onClick={() => navigate('/')} className="back-button">
          <FaChevronLeft /> Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="pre-payment-page">
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
                <label>Full Name*</label>
                <input
                  type="text"
                  name="contact_name"
                  value={newAddress.contact_name || ''}
                  onChange={handleNewAddressChange}
                  required
                  placeholder="Enter recipient's full name"
                />
              </div>
              <div className="form-group">
                <label>Mobile Number*</label>
                <input
                  type="tel"
                  name="mobile_number"
                  value={newAddress.mobile_number || ''}
                  onChange={handleNewAddressChange}
                  required
                  placeholder="Enter contact phone number"
                />
              </div>
              <div className="form-group">
                <label>Street Address*</label>
                <input
                  type="text"
                  name="street_address"
                  value={newAddress.street_address || ''}
                  onChange={handleNewAddressChange}
                  required
                  placeholder="Enter street address"
                />
              </div>
              <div className="form-group">
                <label>Apartment, Suite, Unit (Optional)</label>
                <input
                  type="text"
                  name="apt_suite_unit"
                  value={newAddress.apt_suite_unit || ''}
                  onChange={handleNewAddressChange}
                  placeholder="Apt, Suite, Unit, etc. (optional)"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Province*</label>
                  <select
                    name="province"
                    value={newAddress.province || ''}
                    onChange={handleNewAddressChange}
                    required
                  >
                    <option value="">Select Province</option>
                    <option value="Western">Western</option>
                    <option value="Central">Central</option>
                    <option value="Southern">Southern</option>
                    <option value="Northern">Northern</option>
                    <option value="Eastern">Eastern</option>
                    <option value="North Western">North Western</option>
                    <option value="North Central">North Central</option>
                    <option value="Uva">Uva</option>
                    <option value="Sabaragamuwa">Sabaragamuwa</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>District*</label>
                  <input
                    type="text"
                    name="district"
                    value={newAddress.district || ''}
                    onChange={handleNewAddressChange}
                    required
                    placeholder="Enter district"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Postal Code*</label>
                <input
                  type="text"
                  name="zip_code"
                  value={newAddress.zip_code || ''}
                  onChange={handleNewAddressChange}
                  required
                  placeholder="Enter postal code"
                />
              </div>
              <div className="form-group checkbox">
                <input
                  type="checkbox"
                  id="defaultAddress"
                  name="is_default"
                  checked={newAddress.is_default || false}
                  onChange={handleNewAddressChange}
                />
                <label htmlFor="defaultAddress">Set as default address</label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowAddressForm(false)}>
                Cancel
              </button>
              <button className="save-address-btn" onClick={saveNewAddress}>
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="checkout-container">
        <div className="checkout-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <FaChevronLeft /> Back
          </button>
          <h1>Checkout</h1>
          <div className="checkout-steps">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1. Shipping</div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2. Payment</div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3. Confirmation</div>
          </div>
        </div>

        <div className="checkout-content">
          <div className="order-summary">
            <h2>Order Summary ({orderItems.length} {orderItems.length > 1 ? 'items' : 'item'})</h2>
            
            <div className="order-items">
              {orderItems.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.productName} />
                    <span className="item-quantity">{item.quantity}</span>
                  </div>
                  <div className="item-details">
                    <h3>{item.productName}</h3>
                    <p>{item.size} | {item.color}</p>
                    <div className="item-price">LKR {(item.unitPrice * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>LKR {calculateSubtotal().toFixed(2)}</span>
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

          <div className="checkout-sections">
            {renderShippingAddressSection()}

            <div className="compact-sections-container">
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

            <div className="checkout-actions">
              <button 
                className="continue-button"
                onClick={continueToPayment}
                disabled={!selectedAddress || !selectedDelivery || !selectedPayment || processing}
              >
                {processing ? (
                  <>Processing...</>
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