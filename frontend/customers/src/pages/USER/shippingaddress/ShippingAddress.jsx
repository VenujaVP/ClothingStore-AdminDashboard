// ./pages/USER/shippingaddress/ShippingAddress

/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React from 'react';
import './ShippingAddress.css';

const ShippingAddress = () => {
  return (
    <div className="shipping-address-page">
      <div className="shipping-header">
        <h2>Shipping Address</h2>
        <button className="add-address-btn">+ Add New Address</button>
      </div>

      <div className="address-list">
        {/* Example Address Card */}
        <div className="address-card">
          <div className="address-details">
            <h3>John Doe</h3>
            <p>123 Main Street, Apt 4B</p>
            <p>New York, NY 10001</p>
            <p>United States</p>
            <p>Phone: +1 (123) 456-7890</p>
          </div>
          <div className="address-actions">
            <button className="edit-btn">Edit</button>
            <button className="delete-btn">Delete</button>
          </div>
        </div>

        {/* Example Address Card */}
        <div className="address-card">
          <div className="address-details">
            <h3>Jane Smith</h3>
            <p>456 Elm Street, Suite 10</p>
            <p>Los Angeles, CA 90001</p>
            <p>United States</p>
            <p>Phone: +1 (987) 654-3210</p>
          </div>
          <div className="address-actions">
            <button className="edit-btn">Edit</button>
            <button className="delete-btn">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingAddress;