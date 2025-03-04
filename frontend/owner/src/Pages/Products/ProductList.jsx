/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */

import React, { useState } from 'react';
import './ProductList.css';
import { FaSearch, FaEdit, FaTrash, FaSort, FaFilter } from 'react-icons/fa';

const ProductList = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Product A', category: 'Electronics', price: 299.99, stock: 10 },
    { id: 2, name: 'Product B', category: 'Clothing', price: 49.99, stock: 5 },
    { id: 3, name: 'Product C', category: 'Home & Kitchen', price: 99.99, stock: 20 },
    { id: 4, name: 'Product D', category: 'Electronics', price: 199.99, stock: 15 },
    { id: 5, name: 'Product E', category: 'Clothing', price: 79.99, stock: 0 },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
  });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value,
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

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  // Filter products based on search query and filters
  const filteredProducts = sortedProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filters.category ? product.category === filters.category : true;
    const matchesPrice =
      (filters.minPrice ? product.price >= parseFloat(filters.minPrice) : true) &&
      (filters.maxPrice ? product.price <= parseFloat(filters.maxPrice) : true);
    const matchesStock = filters.inStock ? product.stock > 0 : true;

    return matchesSearch && matchesCategory && matchesPrice && matchesStock;
  });

  // Handle delete product
  const handleDelete = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <div className="product-list-container">
      <div className="product-list-card">
        <h2>Product List</h2>
        <div className="search-bar">
          <div className="input-group">
            <FaSearch className="input-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="filter-section">
          <h3>
            <FaFilter /> Filter Products
          </h3>
          <div className="filter-options">
            <div className="filter-group">
              <label>Category</label>
              <select name="category" value={filters.category} onChange={handleFilterChange}>
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Price Range</label>
              <div className="price-range">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                />
                <span>to</span>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            <div className="filter-group">
              <label>
                <input
                  type="checkbox"
                  name="inStock"
                  checked={filters.inStock}
                  onChange={handleFilterChange}
                />
                In Stock Only
              </label>
            </div>
          </div>
        </div>
        <table className="product-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>
                Name <FaSort className="sort-icon" />
              </th>
              <th onClick={() => handleSort('category')}>
                Category <FaSort className="sort-icon" />
              </th>
              <th onClick={() => handleSort('price')}>
                Price <FaSort className="sort-icon" />
              </th>
              <th onClick={() => handleSort('stock')}>
                Stock <FaSort className="sort-icon" />
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>
                  <button className="edit-btn">
                    <FaEdit /> Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(product.id)}>
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;