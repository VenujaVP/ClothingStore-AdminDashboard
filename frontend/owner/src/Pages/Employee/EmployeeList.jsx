/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */

import React, { useState, useEffect } from 'react';
import withAuth from '../../withAuth';
import './EmployeeList.css';
import { FaSearch, FaEdit, FaTrash, FaSort, FaFilter, FaEye, FaUserShield } from 'react-icons/fa';
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material';

const EmployeeList = () => {
  // Sample data - replace with API call in useEffect
  const [employees, setEmployees] = useState([
    {
      id: 1,
      username: 'johndoe',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone_1: '123-456-7890',
      role: 'Manager',
      entry_date: '2023-01-15',
    },
    {
      id: 2,
      username: 'janesmith',
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@example.com',
      phone_1: '987-654-3210',
      role: 'Sales',
      entry_date: '2023-02-20',
    },
    {
      id: 3,
      username: 'bobwilson',
      first_name: 'Bob',
      last_name: 'Wilson',
      email: 'bob.wilson@example.com',
      phone_1: '555-123-4567',
      role: 'Inventory',
      entry_date: '2023-03-10',
    },
    {
      id: 4,
      username: 'alicejohnson',
      first_name: 'Alice',
      last_name: 'Johnson',
      email: 'alice.johnson@example.com',
      phone_1: '222-333-4444',
      role: 'Sales',
      entry_date: '2023-04-05',
    },
    {
      id: 5,
      username: 'michaelbrown',
      first_name: 'Michael',
      last_name: 'Brown',
      email: 'michael.brown@example.com',
      phone_1: '111-222-3333',
      role: 'Manager',
      entry_date: '2023-05-12',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({
    role: '',
    startDate: '',
    endDate: '',
  });
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Uncomment this to fetch data from API when component mounts
  // useEffect(() => {
  //   const fetchEmployees = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:8082/api/owner/employees');
  //       setEmployees(response.data);
  //     } catch (error) {
  //       console.error('Error fetching employees:', error);
  //       setAlert({
  //         open: true,
  //         message: 'Failed to load employee data',
  //         severity: 'error'
  //       });
  //     }
  //   };
  //   fetchEmployees();
  // }, []);

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

  // Handle delete employee
  const handleDelete = async (id) => {
    // Uncomment this for actual API integration
    // try {
    //   await axios.delete(`http://localhost:8082/api/owner/employees/${id}`);
    //   setEmployees(employees.filter(employee => employee.id !== id));
    //   setAlert({
    //     open: true,
    //     message: 'Employee deleted successfully',
    //     severity: 'success'
    //   });
    // } catch (error) {
    //   console.error('Error deleting employee:', error);
    //   setAlert({
    //     open: true,
    //     message: 'Failed to delete employee',
    //     severity: 'error'
    //   });
    // }

    // For demo, just remove from state
    setEmployees(employees.filter(employee => employee.id !== id));
    setAlert({
      open: true,
      message: 'Employee deleted successfully',
      severity: 'success'
    });
  };

  // Handle view employee details
  const handleView = (id) => {
    // Navigate to employee details page
    console.log(`View employee with ID: ${id}`);
    // Uncomment to implement navigation
    // navigate(`/employee/${id}`);
  };

  // Handle edit employee
  const handleEdit = (id) => {
    console.log(`Edit employee with ID: ${id}`);
    // Uncomment to implement navigation
    // navigate(`/employee/edit/${id}`);
  };

  return (
    <div className="employee-list-container">
      <div className="employee-list-card">
        <h2>Employee List</h2>
        <div className="search-bar">
          <div className="input-group">
            <FaSearch className="input-icon" />
            <input
              type="text"
              placeholder="Search employees..."
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
        <table className="employee-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')}>ID <FaSort className="sort-icon" /></th>
              <th onClick={() => handleSort('username')}>Username <FaSort className="sort-icon" /></th>
              <th onClick={() => handleSort('first_name')}>First Name <FaSort className="sort-icon" /></th>
              <th onClick={() => handleSort('last_name')}>Last Name <FaSort className="sort-icon" /></th>
              <th onClick={() => handleSort('email')}>Email <FaSort className="sort-icon" /></th>
              <th onClick={() => handleSort('phone_1')}>Phone <FaSort className="sort-icon" /></th>
              <th onClick={() => handleSort('role')}>Role <FaSort className="sort-icon" /></th>
              <th onClick={() => handleSort('entry_date')}>Entry Date <FaSort className="sort-icon" /></th>
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
                <td>
                  <button className="view-btn" onClick={() => handleView(employee.id)}>
                    <FaEye /> View
                  </button>
                  <button className="edit-btn" onClick={() => handleEdit(employee.id)}>
                    <FaEdit /> Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(employee.id)}>
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredEmployees.length === 0 && (
          <div className="no-results">No employees match your search criteria</div>
        )}
      </div>
      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={() => setAlert({...alert, open: false})}
      >
        <Alert 
          onClose={() => setAlert({...alert, open: false})} 
          severity={alert.severity} 
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

const AuthenticatedEmployeeList = withAuth(EmployeeList);
export default AuthenticatedEmployeeList;