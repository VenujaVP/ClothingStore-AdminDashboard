/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */

import React, { useState, useEffect } from 'react';
import withAuth from '../../withAuth';
import './EmployeeList.css';
import { 
  FaSearch, FaEdit, FaTrash, FaSort, FaFilter, FaEye, 
  FaUserShield, FaTimes, FaExclamationTriangle, FaCheck 
} from 'react-icons/fa';
import axios from 'axios';
import { Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const EmployeeList = () => {
  // State for employees data
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' });
  const [filters, setFilters] = useState({
    role: '',
    startDate: '',
    endDate: '',
  });
  
  // Dialog states
  const [viewDialog, setViewDialog] = useState({ open: false, employee: null });
  const [editDialog, setEditDialog] = useState({ open: false, employee: null });
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_1: '',
    phone_2: '',
    role: '',
  });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, id: null });
  
  // Form validation
  const [formErrors, setFormErrors] = useState({});
  
  // Alerts
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Function to fetch employees from API
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8082/api/owner/employees');
      if (response.data && response.data.Status === 'success') {
        setEmployees(response.data.employees);
      } else {
        throw new Error(response.data.message || 'Failed to fetch employees');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setAlert({
        open: true,
        message: error.response?.data?.message || 'Failed to load employee data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort employees
  const sortedEmployees = [...employees].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  // Filter employees based on search query and filters
  const filteredEmployees = sortedEmployees.filter((employee) => {
    const fullName = `${employee.first_name} ${employee.last_name}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchQuery.toLowerCase()) || 
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = filters.role ? employee.role === filters.role : true;
    
    // Date filtering
    let matchesDate = true;
    if (filters.startDate && filters.endDate) {
      const entryDate = new Date(employee.entry_date);
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      matchesDate = entryDate >= startDate && entryDate <= endDate;
    } else if (filters.startDate) {
      const entryDate = new Date(employee.entry_date);
      const startDate = new Date(filters.startDate);
      matchesDate = entryDate >= startDate;
    } else if (filters.endDate) {
      const entryDate = new Date(employee.entry_date);
      const endDate = new Date(filters.endDate);
      matchesDate = entryDate <= endDate;
    }

    return matchesSearch && matchesRole && matchesDate;
  });

  // View employee details
  const handleViewEmployee = (employee) => {
    setViewDialog({ open: true, employee });
  };

  // Close view dialog
  const handleCloseViewDialog = () => {
    setViewDialog({ open: false, employee: null });
  };

  // Open edit dialog
  const handleEditEmployee = (employee) => {
    setEditForm({
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email,
      phone_1: employee.phone_1,
      phone_2: employee.phone_2 || '',
      role: employee.role,
    });
    setFormErrors({});
    setEditDialog({ open: true, employee });
  };

  // Close edit dialog
  const handleCloseEditDialog = () => {
    setEditDialog({ open: false, employee: null });
    setFormErrors({});
  };

  // Handle edit form input changes
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value,
    });
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    
    if (!editForm.first_name.trim()) {
      errors.first_name = "First name is required";
    }
    
    if (!editForm.last_name.trim()) {
      errors.last_name = "Last name is required";
    }
    
    if (!editForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(editForm.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!editForm.phone_1.trim()) {
      errors.phone_1 = "Primary phone number is required";
    } else if (!phoneRegex.test(editForm.phone_1.replace(/[^0-9]/g, ''))) {
      errors.phone_1 = "Phone number must be 10 digits";
    }
    
    if (editForm.phone_2 && !phoneRegex.test(editForm.phone_2.replace(/[^0-9]/g, ''))) {
      errors.phone_2 = "Phone number must be 10 digits";
    }
    
    if (!editForm.role.trim()) {
      errors.role = "Role is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit edit form
  const handleSubmitEdit = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      const response = await axios.put(
        `http://localhost:8082/api/owner/employees/${editDialog.employee.id}`,
        {
          first_name: editForm.first_name,
          last_name: editForm.last_name,
          email: editForm.email,
          phone_1: editForm.phone_1,
          phone_2: editForm.phone_2,
          role: editForm.role,
        }
      );
      
      if (response.data && response.data.Status === 'success') {
        // Close dialog and refresh employee list
        setEditDialog({ open: false, employee: null });
        fetchEmployees();
        setAlert({
          open: true,
          message: 'Employee updated successfully',
          severity: 'success'
        });
      } else {
        throw new Error(response.data.message || 'Error updating employee');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      setAlert({
        open: true,
        message: error.response?.data?.message || 'Error updating employee',
        severity: 'error'
      });
    }
  };

  // Open delete confirmation dialog
  const handleConfirmDelete = (id) => {
    setConfirmDialog({ open: true, id });
  };

  // Close delete confirmation dialog
  const handleCloseConfirmDialog = () => {
    setConfirmDialog({ open: false, id: null });
  };

  // Delete employee
  const handleDeleteEmployee = async () => {
    if (!confirmDialog.id) return;
    
    try {
      const response = await axios.delete(`http://localhost:8082/api/owner/employees/${confirmDialog.id}`);
      
      if (response.data && response.data.Status === 'success') {
        // Update employee list
        setEmployees(employees.filter(employee => employee.id !== confirmDialog.id));
        setAlert({
          open: true,
          message: 'Employee deleted successfully',
          severity: 'success'
        });
      } else {
        throw new Error(response.data.message || 'Error deleting employee');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      setAlert({
        open: true,
        message: error.response?.data?.message || 'Error deleting employee',
        severity: 'error'
      });
    } finally {
      // Close confirmation dialog
      setConfirmDialog({ open: false, id: null });
    }
  };

  return (
    <div className="employee-list-container">
      <div className="employee-list-card">
        <h2>Employee Management</h2>
        <div className="search-bar">
          <div className="input-group">
            <FaSearch className="input-icon" />
            <input
              type="text"
              placeholder="Search employees by name, email, or username..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="filter-section">
          <h3>
            <FaFilter /> Filter Employees
          </h3>
          <div className="filter-options">
            <div className="filter-group">
              <label>Role</label>
              <select name="role" value={filters.role} onChange={handleFilterChange}>
                <option value="">All Roles</option>
                <option value="Manager">Manager</option>
                <option value="Sales">Sales</option>
                <option value="Inventory">Inventory</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Entry Date Range</label>
              <div className="date-range">
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                />
                <span>to</span>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="loading-message">Loading employees...</div>
        ) : (
          <table className="employee-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('id')}>ID {sortConfig.key === 'id' && <FaSort className="sort-icon" />}</th>
                <th onClick={() => handleSort('username')}>Username {sortConfig.key === 'username' && <FaSort className="sort-icon" />}</th>
                <th onClick={() => handleSort('first_name')}>First Name {sortConfig.key === 'first_name' && <FaSort className="sort-icon" />}</th>
                <th onClick={() => handleSort('last_name')}>Last Name {sortConfig.key === 'last_name' && <FaSort className="sort-icon" />}</th>
                <th onClick={() => handleSort('email')}>Email {sortConfig.key === 'email' && <FaSort className="sort-icon" />}</th>
                <th onClick={() => handleSort('phone_1')}>Phone {sortConfig.key === 'phone_1' && <FaSort className="sort-icon" />}</th>
                <th onClick={() => handleSort('role')}>Role {sortConfig.key === 'role' && <FaSort className="sort-icon" />}</th>
                <th onClick={() => handleSort('entry_date')}>Entry Date {sortConfig.key === 'entry_date' && <FaSort className="sort-icon" />}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.username}</td>
                  <td>{employee.first_name}</td>
                  <td>{employee.last_name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.phone_1}</td>
                  <td>
                    <span className={`role-badge ${employee.role.toLowerCase()}`}>
                      <FaUserShield /> {employee.role}
                    </span>
                  </td>
                  <td>{employee.entry_date}</td>
                  <td className="action-buttons">
                    <button className="view-btn" onClick={() => handleViewEmployee(employee)}>
                      <FaEye /> View
                    </button>
                    <button className="edit-btn" onClick={() => handleEditEmployee(employee)}>
                      <FaEdit /> Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleConfirmDelete(employee.id)}>
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {!loading && filteredEmployees.length === 0 && (
          <div className="no-results">No employees match your search criteria</div>
        )}
      </div>
      
      {/* View Employee Dialog */}
      <Dialog 
        open={viewDialog.open} 
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="dialog-title">
          Employee Details
          <button className="close-btn" onClick={handleCloseViewDialog}>
            <FaTimes />
          </button>
        </DialogTitle>
        <DialogContent>
          {viewDialog.employee && (
            <div className="employee-details">
              <div className="detail-group">
                <span className="detail-label">Employee ID:</span>
                <span className="detail-value">{viewDialog.employee.id}</span>
              </div>
              <div className="detail-group">
                <span className="detail-label">Username:</span>
                <span className="detail-value">{viewDialog.employee.username}</span>
              </div>
              <div className="detail-group">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{`${viewDialog.employee.first_name} ${viewDialog.employee.last_name}`}</span>
              </div>
              <div className="detail-group">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{viewDialog.employee.email}</span>
              </div>
              <div className="detail-group">
                <span className="detail-label">Primary Phone:</span>
                <span className="detail-value">{viewDialog.employee.phone_1}</span>
              </div>
              <div className="detail-group">
                <span className="detail-label">Secondary Phone:</span>
                <span className="detail-value">{viewDialog.employee.phone_2 || 'Not provided'}</span>
              </div>
              <div className="detail-group">
                <span className="detail-label">Role:</span>
                <span className={`detail-value role-badge ${viewDialog.employee.role.toLowerCase()}`}>
                  <FaUserShield /> {viewDialog.employee.role}
                </span>
              </div>
              <div className="detail-group">
                <span className="detail-label">Entry Date:</span>
                <span className="detail-value">{viewDialog.employee.entry_date}</span>
              </div>
              <div className="detail-group">
                <span className="detail-label">Created At:</span>
                <span className="detail-value">{new Date(viewDialog.employee.createdAt).toLocaleString()}</span>
              </div>
              <div className="detail-group">
                <span className="detail-label">Last Updated:</span>
                <span className="detail-value">{new Date(viewDialog.employee.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog} color="primary" variant="contained">
            Close
          </Button>
          <Button 
            onClick={() => {
              handleCloseViewDialog();
              if (viewDialog.employee) {
                handleEditEmployee(viewDialog.employee);
              }
            }} 
            color="secondary"
            variant="contained"
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Employee Dialog */}
      <Dialog 
        open={editDialog.open} 
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="dialog-title">
          Edit Employee
          <button className="close-btn" onClick={handleCloseEditDialog}>
            <FaTimes />
          </button>
        </DialogTitle>
        <DialogContent>
          {editDialog.employee && (
            <div className="edit-form">
              <div className="form-row">
                <div className="form-group">
                  <TextField
                    label="First Name"
                    name="first_name"
                    value={editForm.first_name}
                    onChange={handleEditFormChange}
                    fullWidth
                    margin="normal"
                    error={!!formErrors.first_name}
                    helperText={formErrors.first_name}
                  />
                </div>
                <div className="form-group">
                  <TextField
                    label="Last Name"
                    name="last_name"
                    value={editForm.last_name}
                    onChange={handleEditFormChange}
                    fullWidth
                    margin="normal"
                    error={!!formErrors.last_name}
                    helperText={formErrors.last_name}
                  />
                </div>
              </div>
              <TextField
                label="Email"
                name="email"
                value={editForm.email}
                onChange={handleEditFormChange}
                fullWidth
                margin="normal"
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
              <div className="form-row">
                <div className="form-group">
                  <TextField
                    label="Primary Phone"
                    name="phone_1"
                    value={editForm.phone_1}
                    onChange={handleEditFormChange}
                    fullWidth
                    margin="normal"
                    error={!!formErrors.phone_1}
                    helperText={formErrors.phone_1}
                  />
                </div>
                <div className="form-group">
                  <TextField
                    label="Secondary Phone (Optional)"
                    name="phone_2"
                    value={editForm.phone_2}
                    onChange={handleEditFormChange}
                    fullWidth
                    margin="normal"
                    error={!!formErrors.phone_2}
                    helperText={formErrors.phone_2}
                  />
                </div>
              </div>
              <FormControl fullWidth margin="normal" error={!!formErrors.role}>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={editForm.role}
                  onChange={handleEditFormChange}
                  label="Role"
                >
                  <MenuItem value="Manager">Manager</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Sales">Sales</MenuItem>
                  <MenuItem value="Inventory">Inventory</MenuItem>
                </Select>
                {formErrors.role && (
                  <span className="error-text">{formErrors.role}</span>
                )}
              </FormControl>
              
              <div className="form-info">
                <p className="info-text">
                  <strong>Note:</strong> Some fields cannot be changed:
                </p>
                <ul className="info-list">
                  <li>Username: {editDialog.employee.username}</li>
                  <li>Entry Date: {editDialog.employee.entry_date}</li>
                  <li>Employee ID: {editDialog.employee.id}</li>
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="default" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmitEdit} color="primary" variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={confirmDialog.open} 
        onClose={handleCloseConfirmDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="warning-dialog-title">
          <FaExclamationTriangle /> Confirm Delete
        </DialogTitle>
        <DialogContent>
          <div className="confirm-delete-content">
            <p>Are you sure you want to delete this employee?</p>
            <p>This action cannot be undone.</p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="default" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleDeleteEmployee} color="error" variant="contained" startIcon={<FaTrash />}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notification Snackbar */}
      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={() => setAlert({...alert, open: false})}
      >
        <Alert 
          onClose={() => setAlert({...alert, open: false})} 
          severity={alert.severity} 
          sx={{ width: '100%' }}
          icon={alert.severity === 'success' ? <FaCheck /> : <FaExclamationTriangle />}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

const AuthenticatedEmployeeList = withAuth(EmployeeList);
export default AuthenticatedEmployeeList;