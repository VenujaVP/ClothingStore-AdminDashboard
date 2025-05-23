/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */

import React, { useState } from 'react';
import './AddEmployee.css';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaCalendar, FaUserTag, FaIdCard } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import withAuth from '../withAuth';
import {addEmployeeValidationSchema} from '../inputValidations'

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    employee_uname: '',
    email: '',
    f_name: '',
    l_name: '',
    password: '',
    com_password: '',
    role: '',
    phone_1: '',
    phone_2: '',
    entry_date: ''
  });

  const [errors, setErrors] = useState({});
  const [alertSeverity, setAlertSeverity] = useState('');
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate the form data
    addEmployeeValidationSchema
      .validate(formData, { abortEarly: false })
      .then(() => {
        // Send data to the backend
        axios.post('http://localhost:8082/api/owner/owner-create-employee', formData)
          .then(res => {
            if (res.data && res.data.Status === "Success") {
              console.log('Employee added successfully:', res.data);
              setFormData({
                employee_uname: '',
                email: '',
                f_name: '',
                l_name: '',
                password: '',
                com_password: '',
                phone_1: '',
                phone_2: '',
                entry_date: '',
                role: ''
              });            
          } else {
              console.error('Error adding employee:', res);
              setAlertSeverity("error");
              setMessage(res.data.Error || 'An error occurred while adding employee');
              setOpen(true);
            }
          })
          .catch(err => {
            console.error('Error:', err);
            setAlertSeverity('error');
            setMessage(err.response?.data?.message || 'Server error. Please try again.');
            setOpen(true);
          });
      })
      .catch(err => {
        const validationErrors = {};
        err.inner.forEach(error => {
          validationErrors[error.path] = error.message; // Collect validation errors
        });
        setErrors(validationErrors); // Set errors to state for display
        console.error('Validation Error:', validationErrors);
      });
  };

  return (
    <div className="add-employee-container">
      <div className="add-employee-card">
        <h2>Add New Employee</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Employee User Name</label>
              <div className="input-group">
                <FaIdCard className="input-icon" />
                <input
                  type="text"
                  name="employee_uname"
                  placeholder="Enter Employee User Name"
                  value={formData.employee_uname}
                  onChange={handleChange}
                  required
                />
                {errors.employee_id && <span className="error-text">{errors.employee_id}</span>}
              </div>
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-group">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <div className="input-group">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="f_name"
                  placeholder="Enter first name"
                  value={formData.f_name}
                  onChange={handleChange}
                  required
                />
                {errors.f_name && <span className="error-text">{errors.f_name}</span>}
              </div>
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <div className="input-group">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="l_name"
                  placeholder="Enter last name"
                  value={formData.l_name}
                  onChange={handleChange}
                  required
                />
                {errors.l_name && <span className="error-text">{errors.l_name}</span>}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  name="com_password"
                  placeholder="Re-enter password"
                  value={formData.com_password}
                  onChange={handleChange}
                  required
                />
                {errors.com_password && <span className="error-text">{errors.com_password}</span>}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Entry Date</label>
              <div className="input-group">
                <FaCalendar className="input-icon" />
                <input
                  type="date"
                  name="entry_date"
                  value={formData.entry_date}
                  onChange={handleChange}
                  required
                />
                {errors.entry_date && <span className="error-text">{errors.entry_date}</span>}
              </div>
            </div>
            <div className="form-group">
              <label>Role</label>
              <div className="input-group">
                <FaUserTag className="input-icon" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select role</option>
                  <option value="admin">Cashier</option>
                  <option value="employee">Employee</option>
                </select>
                {errors.role && <span className="error-text">{errors.role}</span>}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Primary Phone</label>
              <div className="input-group">
                <FaPhone className="input-icon" />
                <input
                  type="tel"
                  name="phone_1"
                  placeholder="Enter primary phone"
                  value={formData.phone_1}
                  onChange={handleChange}
                  required
                />
                {errors.phone_1 && <span className="error-text">{errors.phone_1}</span>}
              </div>
            </div>
            <div className="form-group">
              <label>Secondary Phone (Optional)</label>
              <div className="input-group">
                <FaPhone className="input-icon" />
                <input
                  type="tel"
                  name="phone_2"
                  placeholder="Enter secondary phone"
                  value={formData.phone_2}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn">Cancel</button>
            <button type="submit" className="submit-btn">Add Employee</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// export default AddEmployee;
const AuthenticatedAddEmployee = withAuth(AddEmployee);
export default AuthenticatedAddEmployee;