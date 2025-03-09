/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */

import React, { useState } from 'react';
import './AddExpenses.css';
import { FaCalendar, FaTag, FaInfoCircle, FaImage, FaMoneyBillAlt } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import withAuth from '../withAuth';
import { addExpensesValidationSchema } from '../inputValidations'; // Assuming you have a validation schema for expenses

const AddExpenses = () => {
  const [formData, setFormData] = useState({
    expenses_id: '',
    date: '',
    expenses_name: '',
    cost: '',
    description: '',
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [alertSeverity, setAlertSeverity] = useState('');
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        image: file,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate the form data
    addExpensesValidationSchema
      .validate(formData, { abortEarly: false })
      .then(() => {
        // Send data to the backend
        const formDataToSend = new FormData();
        formDataToSend.append('expenses_id', formData.expenses_id);
        formDataToSend.append('date', formData.date);
        formDataToSend.append('expenses_name', formData.expenses_name);
        formDataToSend.append('cost', formData.cost);
        formDataToSend.append('description', formData.description);
        if (formData.image) {
          formDataToSend.append('image', formData.image);
        }

        axios
          .post('http://localhost:8082/api/owner/owner-add-expenses', formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((res) => {
            if (res.data && res.data.Status === 'Success') {
              console.log('Expense added successfully:', res.data);
              setFormData({
                expenses_id: '',
                date: '',
                expenses_name: '',
                cost: '',
                description: '',
                image: null,
              });
              setAlertSeverity('success');
              setMessage('Expense added successfully!');
              setOpen(true);
            } else {
              console.error('Error adding expense:', res);
              setAlertSeverity('error');
              setMessage(res.data.Error || 'An error occurred while adding expense');
              setOpen(true);
            }
          })
          .catch((err) => {
            console.error('Error:', err);
            setAlertSeverity('error');
            setMessage(err.response?.data?.message || 'Server error. Please try again.');
            setOpen(true);
          });
      })
      .catch((err) => {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message; // Collect validation errors
        });
        setErrors(validationErrors); // Set errors to state for display
        console.error('Validation Error:', validationErrors);
      });
  };

  return (
    <div className="add-expenses-container">
      <div className="add-expenses-card">
        <h2>Add New Expense</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Expense ID</label>
              <div className="input-group">
                <FaTag className="input-icon" />
                <input
                  type="text"
                  name="expenses_id"
                  placeholder="Enter Expense ID"
                  value={formData.expenses_id}
                  onChange={handleChange}
                  required
                />
                {errors.expenses_id && <span className="error-text">{errors.expenses_id}</span>}
              </div>
            </div>
            <div className="form-group">
              <label>Date</label>
              <div className="input-group">
                <FaCalendar className="input-icon" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
                {errors.date && <span className="error-text">{errors.date}</span>}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Expense Name</label>
              <div className="input-group">
                <FaTag className="input-icon" />
                <input
                  type="text"
                  name="expenses_name"
                  placeholder="Enter Expense Name"
                  value={formData.expenses_name}
                  onChange={handleChange}
                  required
                />
                {errors.expenses_name && <span className="error-text">{errors.expenses_name}</span>}
              </div>
            </div>
            <div className="form-group">
              <label>Cost</label>
              <div className="input-group">
                <FaMoneyBillAlt className="input-icon" />
                <input
                  type="number"
                  name="cost"
                  placeholder="Enter Cost"
                  value={formData.cost}
                  onChange={handleChange}
                  required
                />
                {errors.cost && <span className="error-text">{errors.cost}</span>}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Description</label>
              <div className="input-group">
                <FaInfoCircle className="input-icon" />
                <textarea
                  name="description"
                  placeholder="Enter Description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
                {errors.description && <span className="error-text">{errors.description}</span>}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Upload Image</label>
              <div className="input-group">
                <FaImage className="input-icon" />
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AuthenticatedAddExpenses = withAuth(AddExpenses);
export default AuthenticatedAddExpenses;