import React, { useState } from 'react';
import './AddEmployee.css';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaCalendar, FaUserTag } from 'react-icons/fa';

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    employee_id: '',
    email: '',
    password: '',
    f_name: '',
    l_name: '',
    role: '',
    phone_1: '',
    phone_2: '',
    entry_date: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Add your submit logic here
  };

  return (
    <div className="add-employee-container">
      <div className="add-employee-card">
        <h2>Add New Employee</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <div className="input-group">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="employee_id"
                  placeholder="Employee ID"
                  value={formData.employee_id}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <div className="input-group">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <div className="input-group">
                <FaUserTag className="input-icon" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="employee">Employee</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <div className="input-group">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="f_name"
                  placeholder="First Name"
                  value={formData.f_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <div className="input-group">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="l_name"
                  placeholder="Last Name"
                  value={formData.l_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <div className="input-group">
                <FaPhone className="input-icon" />
                <input
                  type="tel"
                  name="phone_1"
                  placeholder="Primary Phone"
                  value={formData.phone_1}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <div className="input-group">
                <FaPhone className="input-icon" />
                <input
                  type="tel"
                  name="phone_2"
                  placeholder="Secondary Phone (Optional)"
                  value={formData.phone_2}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <div className="input-group">
                <FaCalendar className="input-icon" />
                <input
                  type="date"
                  name="entry_date"
                  value={formData.entry_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">Add Employee</button>
            <button type="button" className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
