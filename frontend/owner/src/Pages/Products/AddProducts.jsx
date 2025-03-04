/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */

import React, { useState } from 'react';
import './AddProducts.css';
import { FaBox, FaTag, FaInfoCircle, FaWeightHanging, FaPlus, FaCalendar, FaTshirt, FaPalette, FaBalanceScale, FaVenusMars, FaStar, FaHeart, FaMinus } from 'react-icons/fa';

const AddProducts = () => {
    const [uploadedImages, setUploadedImages] = useState([]);
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
    product_variations: [{ size: '', color: '', units: '' }]
  });

  const handleImageChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      const updatedImages = [...uploadedImages, ...newImages];
      if (updatedImages.length > 10) {
        alert("You can upload up to 10 images.");
        return;
      }
      setUploadedImages(updatedImages);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...uploadedImages];
    updatedImages.splice(index, 1);
    setUploadedImages(updatedImages);
  };

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

  const removeVariation = (indexToRemove) => {
    if (formData.product_variations.length > 1) {
      setFormData(prevState => ({
        ...prevState,
        product_variations: prevState.product_variations.filter((_, index) => index !== indexToRemove)
      }));
    }
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

          {/* Availability Status, Wishlist Count, Final Rating */}
          <div className="form-row display-row">
            <div className="form-group">
              <label>Availability Status</label>
              <div className="display-field">
                <FaBox className="input-icon" />
                <span>{formData.availability_status}</span>
              </div>
            </div>
            <div className="form-group">
              <label>Wishlist Count</label>
              <div className="display-field">
                <FaHeart className="input-icon" />
                <span>{formData.wishlist_count}</span>
              </div>
            </div>
            <div className="form-group">
              <label>Final Rating</label>
              <div className="display-field">
                <FaStar className="input-icon" />
                <span>{formData.final_rating}</span>
              </div>
            </div>
          </div>

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

          {/* Image Upload Section */}
          <div className="image-upload-section">
            <label>Upload Product Images (Up to 10)</label>
            <div className="image-upload-wrapper">
              {uploadedImages.map((image, index) => (
                <div key={index} className="uploaded-image-preview-container">
                  <img src={image} alt="Uploaded Preview" className="uploaded-image-preview" />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => handleRemoveImage(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              {uploadedImages.length < 10 && (
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="image-upload-input"
                />
              )}
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
                  placeholder="Enter shipping weight (KG)"
                  value={formData.shipping_weight}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Product Variations */}
          <div className="variations-container">
            <label>Product Variations</label>
            <div className="variations-wrapper">
              {formData.product_variations.map((variation, index) => (
                <div className="variation-row" key={index}>
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
                  <button
                    type="button"
                    className="remove-variation-btn"
                    onClick={() => removeVariation(index)}
                    disabled={formData.product_variations.length === 1}
                  >
                    <FaMinus />
                  </button>
                </div>
              ))}
              <button type="button" className="add-variation-btn" onClick={addVariation}>
                <FaPlus />
              </button>
            </div>
          </div>

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
                  <option value="Female">Kids</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Limited Edition</label>
              <div className="input-group">
                <FaVenusMars className="input-icon" />
                <select
                  name="limited_edition"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Material and Fabric Type */}
          <div className="form-row">
  {/* Material Selection */}
  <div className="form-group">
    <label>Material</label>
    <div className="input-group">
      <FaTshirt className="input-icon" />
      <select
        name="material"
        value={formData.material}
        onChange={handleChange}
        required
      >
        <option value="">Select Material</option>
        <option value="Cotton">Cotton</option>
        <option value="Silk">Silk</option>
        <option value="Linen">Linen</option>
        <option value="Polyester">Polyester</option>
        <option value="Wool">Wool</option>
        <option value="Denim">Denim</option>
        <option value="Leather">Leather</option>
      </select>
    </div>
  </div>

  {/* Fabric Type Selection */}
  <div className="form-group">
    <label>Fabric Type</label>
    <div className="input-group">
      <FaTshirt className="input-icon" />
      <select
        name="fabric_type"
        value={formData.fabric_type}
        onChange={handleChange}
        required
      >
        <option value="">Select Fabric Type</option>
        <option value="Twill">Twill</option>
        <option value="Satin">Satin</option>
        <option value="Jersey">Jersey</option>
        <option value="Ribbed">Ribbed</option>
        <option value="Chiffon">Chiffon</option>
        <option value="Velvet">Velvet</option>
        <option value="Canvas">Canvas</option>
      </select>
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
