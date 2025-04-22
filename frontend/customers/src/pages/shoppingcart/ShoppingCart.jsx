//import './ShoppingCart.css';
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState } from 'react';
import './ShoppingCart.css';
import withAuth from '../withAuth';
import { FaShoppingCart, FaCreditCard, FaShieldAlt, FaStore, FaTrash } from 'react-icons/fa';

const ShoppingCart = ({ userId }) => {
    const [items, setItems] = useState([
        {
            id: 1,
            name: "Classic Cotton T-Shirt",
            seller: "Fashion Store",
            color: "White",
            size: "M",
            quantity: 1,
            price: 29.99,
            discount: 5,
            image: "tshirt-image-url.jpg",
            selected: false
        },
        {
            id: 2,
            name: "Denim Jeans",
            seller: "Denim World",
            color: "Blue",
            size: "32",
            quantity: 1,
            price: 59.99,
            discount: 10,
            image: "jeans-image-url.jpg",
            selected: false
        },
        // Add more items as needed
    ]);

    const [selectAll, setSelectAll] = useState(false);

    // Toggle select all items
    const toggleSelectAll = () => {
        setSelectAll(!selectAll);
        setItems(items.map(item => ({ ...item, selected: !selectAll })));
    };

    // Toggle individual item selection
    const toggleItemSelection = (itemId) => {
        setItems(items.map(item => 
            item.id === itemId 
                ? { ...item, selected: !item.selected }
                : item
        ));
        // Update selectAll state based on all items being selected
        const updatedItems = items.map(item => 
            item.id === itemId ? { ...item, selected: !item.selected } : item
        );
        setSelectAll(updatedItems.every(item => item.selected));
    };

    // Update item quantity
    const updateQuantity = (id, newQuantity) => {
        if (newQuantity >= 1) {
            setItems(items.map(item => 
                item.id === id ? { ...item, quantity: newQuantity } : item
            ));
        }
    };

    // Remove item from cart
    const removeItem = (itemId) => {
        setItems(items.filter(item => item.id !== itemId));
    };

    // Calculate selected items count
    const selectedItemsCount = items.filter(item => item.selected).length;

    // Calculate totals
    const calculateSubtotal = () => {
        return items.reduce((total, item) => {
            if (item.selected) {
                return total + (item.price * item.quantity);
            }
            return total;
        }, 0);
    };

    const calculateDiscount = () => {
        return items.reduce((total, item) => {
            if (item.selected) {
                return total + (item.price * item.quantity * (item.discount / 100));
            }
            return total;
        }, 0);
    };

    const calculateTotal = () => {
        return calculateSubtotal() - calculateDiscount();
    };

    return (
        <div className="cart-page">
            <div className="cart-container">
                <div className="cart-header">
                    <h1><FaShoppingCart /> Cart ({items.length})</h1>
                    <div className="select-all">
                        <input 
                            type="checkbox" 
                            checked={selectAll}
                            onChange={toggleSelectAll}
                        />
                        <span>Select All Items</span>
                    </div>
                </div>

                <div className="cart-content-wrapper">
                    <div className="cart-cart-items-section">
                        <div className="cart-cart-items">
                            {items.map(item => (
                                <div key={item.id} className={`cart-item ${item.selected ? 'selected' : ''}`}>
                                    <input 
                                        type="checkbox"
                                        checked={item.selected}
                                        onChange={() => toggleItemSelection(item.id)}
                                    />
                                    <div className="item-image">
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                    <div className="item-details">
                                        <h3>{item.name}</h3>
                                        <div className="item-options">
                                            <select defaultValue={item.color}>
                                                <option>White</option>
                                                <option>Black</option>
                                                <option>Blue</option>
                                            </select>
                                            <select defaultValue={item.size}>
                                                <option>S</option>
                                                <option>M</option>
                                                <option>L</option>
                                                <option>XL</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="item-quantity-cart">
                                        <button  onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                    </div>
                                    <div className="item-price">
                                        <span className="price">${(item.price * item.quantity).toFixed(2)}</span>
                                        {/* {item.discount > 0 && (
                                            <span className="discount">-{item.discount}%</span>
                                        )} */}
                                    </div>
                                    <button 
                                        className="remove-item"
                                        onClick={() => removeItem(item.id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="cart-summary">
                        <div className="summary-details">
                            <h2>Order Summary</h2>
                            <div className="summary-row">
                                <span>Selected Items</span>
                                <span>{selectedItemsCount}</span>
                            </div>
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>${calculateSubtotal().toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Discount</span>
                                <span>-${calculateDiscount().toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="summary-total">
                                <span>Total</span>
                                <span>${calculateTotal().toFixed(2)}</span>
                            </div>
                            <button 
                                className="checkout-btn"
                                disabled={selectedItemsCount === 0}
                            >
                                Proceed to Checkout ({selectedItemsCount})
                            </button>
                        </div>

                        <div className="payment-options">
                            <h3>Payment Methods</h3>
                            <div className="payment-icons">
                                <FaCreditCard />
                                <span>VISA</span>
                                <FaCreditCard />
                                <span>Mastercard</span>
                            </div>
                        </div>

                        <div className="buyer-protection">
                            <FaShieldAlt />
                            <p>Buyer Protection: Get full refund if the item is not as described or not delivered</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AuthenticatedShoppingCart = withAuth(ShoppingCart);  
export default AuthenticatedShoppingCart;
