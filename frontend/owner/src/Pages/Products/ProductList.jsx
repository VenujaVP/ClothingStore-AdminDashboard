/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */

import React, { useState } from 'react';
import './ProductList.css';
import { FaSearch, FaEdit, FaTrash, FaSort } from 'react-icons/fa';

const ProductList = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Product A', category: 'Electronics', price: 299.99, stock: 10 },
    { id: 2, name: 'Product B', category: 'Clothing', price: 49.99, stock: 5 },
    { id: 3, name: 'Product C', category: 'Home & Kitchen', price: 99.99, stock: 20 },
    { id: 4, name: 'Product D', category: 'Electronics', price: 199.99, stock: 15 },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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

  // Filter products based on search query
  const filteredProducts = sortedProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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