// ./pages/USER/shippingaddressform/ShippingAddressForm

/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState } from 'react';
import './ShippingAddressForm .css'
import withAuth from '../../withAuth';

const ShippingAddressForm = ({ userId }) => {
  const [formData, setFormData] = useState({
    contactName: '',
    mobileNumber: '',
    streetAddress: '',
    aptSuiteUnit: '',
    province: '',
    district: '',
    zipCode: '',
    isDefaultAddress: false,
  });

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    // Add your form submission logic here
  };

  return (
    <div className="shipping-address-page">
      <h2>Shipping Address</h2>
      <form onSubmit={handleSubmit} className="address-form">
        {/* Contact Information */}
        <div className="form-group">
          <label htmlFor="contactName">Contact Name <span className="required">*</span></label>
          <input
            type="text"
            id="contactName"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="mobileNumber">Mobile Number <span className="required">*</span></label>
            <div className="input-with-prefix">
              <span className="prefix">+94</span>
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="form-group">
          <label htmlFor="streetAddress">Street Address <span className="required">*</span></label>
          <input
            type="text"
            id="streetAddress"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="aptSuiteUnit">Apt, Suite, Unit, etc (optional)</label>
          <input
            type="text"
            id="aptSuiteUnit"
            name="aptSuiteUnit"
            value={formData.aptSuiteUnit}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="province">Province <span className="required">*</span></label>
            <select
              id="province"
              name="province"
              value={formData.province}
              onChange={handleChange}
              required
            >
              <option value="">Select Province</option>
              {provinces.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="district">District <span className="required">*</span></label>
            <select
              id="district"
              name="district"
              value={formData.district}
              onChange={handleChange}
              required
              disabled={!formData.province}
            >
              <option value="">Select District</option>
              {formData.province &&
                districts[formData.province].map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="zipCode">ZIP Code <span className="required">*</span></label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            required
          />
        </div>

        {/* Default Address Checkbox */}
        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="isDefaultAddress"
            name="isDefaultAddress"
            checked={formData.isDefaultAddress}
            onChange={handleChange}
          />
          <label htmlFor="isDefaultAddress">Set as default shipping address</label>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="submit" className="submit-btn">Confirm</button>
          <button type="button" className="cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  );
};

const AuthenticatedShippingAddressForm = withAuth(ShippingAddressForm);  
export default AuthenticatedShippingAddressForm;