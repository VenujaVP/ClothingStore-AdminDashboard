/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */

import React, { useState } from 'react';
import './AddProducts.css';
import { FaBox, FaTag, FaInfoCircle, FaWeightHanging, FaPlus, FaCalendar, FaTshirt, FaPalette, FaBalanceScale, FaVenusMars, FaStar, FaHeart } from 'react-icons/fa';

const AddProducts = () => {
  const [formData, setFormData] = useState({
    product_id: '',
    product_name: '',
    product_description: '',
    unit_price: '',
    date_added: '',
    shipping_weight: '',
    size: '',
    color: '',
    units: '',
    total_units: '',
    gender: '',
    limited_edition: false,
    material: '',
    fabric_type: '',
    return_policy: '',
    availability_status: 'In Stock',
    wishlist_count: 0,
    final_rating: 0,
    product_variations: [{ size: '', color: '', units: '' }]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleVariationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariations = [...formData.product_variations];
    updatedVariations[index][name] = value;
    setFormData(prevState => ({
      ...prevState,
      product_variations: updatedVariations
    }));
  };

  const addVariation = () => {
    setFormData(prevState => ({
      ...prevState,
      product_variations: [...prevState.product_variations, { size: '', color: '', units: '' }]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Add your submit logic here
  };

  return (
    <div className="add-product-container">
      <div className="add-product-card">
        <h2>Add New Product</h2>
        <form onSubmit={handleSubmit}>
          {/* Product ID and Name */}
          <div className="form-row">
            <div className="form-group">
              <label>Product ID</label>
              <div className="input-group">
                <FaTag className="input-icon" />
                <input
                  type="text"
                  name="product_id"
                  placeholder="Enter product ID"
                  value={formData.product_id}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Product Name</label>
              <div className="input-group">
                <FaBox className="input-icon" />
                <input
                  type="text"
                  name="product_name"
                  placeholder="Enter product name"
                  value={formData.product_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="form-row">
            <div className="form-group">
              <label>Product Description</label>
              <div className="input-group">
                <FaInfoCircle className="input-icon" />
                <textarea
                  name="product_description"
                  placeholder="Enter product description"
                  value={formData.product_description}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Unit Price, Date Added, Shipping Weight */}
          <div className="form-row">
            <div className="form-group">
              <label>Unit Price</label>
              <div className="input-group">
                <FaTag className="input-icon" />
                <input
                  type="number"
                  name="unit_price"
                  placeholder="Enter unit price"
                  value={formData.unit_price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Date Added</label>
              <div className="input-group">
                <FaCalendar className="input-icon" />
                <input
                  type="date"
                  name="date_added"
                  value={formData.date_added}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Shipping Weight</label>
              <div className="input-group">
                <FaWeightHanging className="input-icon" />
                <input
                  type="number"
                  name="shipping_weight"
                  placeholder="Enter shipping weight"
                  value={formData.shipping_weight}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Product Variations */}
          {formData.product_variations.map((variation, index) => (
            <div className="form-row" key={index}>
              <div className="form-group">
                <label>Size</label>
                <div className="input-group">
                  <FaTshirt className="input-icon" />
                  <input
                    type="text"
                    name="size"
                    placeholder="Enter size"
                    value={variation.size}
                    onChange={(e) => handleVariationChange(index, e)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Color</label>
                <div className="input-group">
                  <FaPalette className="input-icon" />
                  <input
                    type="text"
                    name="color"
                    placeholder="Enter color"
                    value={variation.color}
                    onChange={(e) => handleVariationChange(index, e)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Units</label>
                <div className="input-group">
                  <FaBalanceScale className="input-icon" />
                  <input
                    type="number"
                    name="units"
                    placeholder="Enter units"
                    value={variation.units}
                    onChange={(e) => handleVariationChange(index, e)}
                    required
                  />
                </div>
              </div>
              {index === formData.product_variations.length - 1 && (
                <button type="button" className="add-variation-btn" onClick={addVariation}>
                  <FaPlus />
                </button>
              )}
            </div>
          ))}

          {/* Total Units */}
          <div className="form-row">
            <div className="form-group">
              <label>Total Units</label>
              <div className="input-group">
                <FaBalanceScale className="input-icon" />
                <input
                  type="number"
                  name="total_units"
                  placeholder="Enter total units"
                  value={formData.total_units}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Gender and Limited Edition */}
          <div className="form-row">
            <div className="form-group">
              <label>Gender</label>
              <div className="input-group">
                <FaVenusMars className="input-icon" />
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Limited Edition</label>
              <div className="input-group">
                <input
                  type="checkbox"
                  name="limited_edition"
                  checked={formData.limited_edition}
                  onChange={(e) => setFormData(prevState => ({ ...prevState, limited_edition: e.target.checked }))}
                />
              </div>
            </div>
          </div>

          {/* Material and Fabric Type */}
          <div className="form-row">
            <div className="form-group">
              <label>Material</label>
              <div className="input-group">
                <FaTshirt className="input-icon" />
                <input
                  type="text"
                  name="material"
                  placeholder="Enter material"
                  value={formData.material}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Fabric Type</label>
              <div className="input-group">
                <FaTshirt className="input-icon" />
                <input
                  type="text"
                  name="fabric_type"
                  placeholder="Enter fabric type"
                  value={formData.fabric_type}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Return Policy */}
          <div className="form-row">
            <div className="form-group">
              <label>Return Policy</label>
              <div className="input-group">
                <FaInfoCircle className="input-icon" />
                <textarea
                  name="return_policy"
                  placeholder="Enter return policy"
                  value={formData.return_policy}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Availability Status, Wishlist Count, Final Rating */}
          <div className="form-row">
            <div className="form-group">
              <label>Availability Status</label>
              <div className="input-group">
                <FaBox className="input-icon" />
                <select
                  name="availability_status"
                  value={formData.availability_status}
                  onChange={handleChange}
                  required
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Pre-Order">Pre-Order</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Wishlist Count</label>
              <div className="input-group">
                <FaHeart className="input-icon" />
                <input
                  type="number"
                  name="wishlist_count"
                  placeholder="Enter wishlist count"
                  value={formData.wishlist_count}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Final Rating</label>
              <div className="input-group">
                <FaStar className="input-icon" />
                <input
                  type="number"
                  name="final_rating"
                  placeholder="Enter final rating"
                  value={formData.final_rating}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" className="cancel-btn">Cancel</button>
            <button type="submit" className="submit-btn">Add Product</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProducts;