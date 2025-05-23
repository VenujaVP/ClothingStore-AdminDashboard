/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */

import React, { useState } from 'react';
import withAuth from '../withAuth';
import './ProductList.css';
import { FaSearch, FaEdit, FaTrash, FaSort, FaFilter, FaEye } from 'react-icons/fa';

const ProductList = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Product A',
      dateAdded: '2023-01-01',
      category1: 'Electronics',
      category2: 'Gadgets',
      price: 299.99,
      stock: 10,
    },
    {
      id: 2,
      name: 'Product B',
      dateAdded: '2023-02-01',
      category1: 'Clothing',
      category2: 'Menswear',
      price: 49.99,
      stock: 5,
    },
    {
      id: 3,
      name: 'Product C',
      dateAdded: '2023-03-01',
      category1: 'Home & Kitchen',
      category2: 'Kitchenware',
      price: 99.99,
      stock: 20,
    },
    {
      id: 4,
      name: 'Product D',
      dateAdded: '2023-04-01',
      category1: 'Electronics',
      category2: 'Accessories',
      price: 199.99,
      stock: 15,
    },
    {
      id: 5,
      name: 'Product E',
      dateAdded: '2023-05-01',
      category1: 'Clothing',
      category2: 'Womenswear',
      price: 79.99,
      stock: 0,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({
    category1: '',
    category2: '',
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
    const matchesCategory1 = filters.category1 ? product.category1 === filters.category1 : true;
    const matchesCategory2 = filters.category2 ? product.category2 === filters.category2 : true;
    const matchesPrice =
      (filters.minPrice ? product.price >= parseFloat(filters.minPrice) : true) &&
      (filters.maxPrice ? product.price <= parseFloat(filters.maxPrice) : true);
    const matchesStock = filters.inStock ? product.stock > 0 : true;

    return matchesSearch && matchesCategory1 && matchesCategory2 && matchesPrice && matchesStock;
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
              <label>Category 1</label>
              <select name="category1" value={filters.category1} onChange={handleFilterChange}>
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Category 2</label>
              <select name="category2" value={filters.category2} onChange={handleFilterChange}>
                <option value="">All Subcategories</option>
                <option value="Gadgets">Gadgets</option>
                <option value="Menswear">Menswear</option>
                <option value="Kitchenware">Kitchenware</option>
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
              <th onClick={() => handleSort('id')}>Product ID <FaSort className="sort-icon" /></th>
              <th onClick={() => handleSort('name')}>Name <FaSort className="sort-icon" /></th>
              <th onClick={() => handleSort('dateAdded')}>Date Added <FaSort className="sort-icon" /></th>
              <th onClick={() => handleSort('category1')}>Category 1 <FaSort className="sort-icon" /></th>
              <th onClick={() => handleSort('category2')}>Category 2 <FaSort className="sort-icon" /></th>
              <th onClick={() => handleSort('price')}>Price <FaSort className="sort-icon" /></th>
              <th onClick={() => handleSort('stock')}>Stock <FaSort className="sort-icon" /></th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.dateAdded}</td>
                <td>{product.category1}</td>
                <td>{product.category2}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>
                  <button className="view-btn">
                    <FaEye /> View
                  </button>
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

// export default ProductList;

const AuthenticatedProductList = withAuth(ProductList);
export default AuthenticatedProductList;
