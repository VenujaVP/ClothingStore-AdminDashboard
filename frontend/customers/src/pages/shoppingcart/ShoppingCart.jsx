/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import './ShoppingCart.css';
import withAuth from '../withAuth';
import { FaShoppingCart, FaCreditCard, FaShieldAlt, FaTrash } from 'react-icons/fa';
import axios from 'axios';

const ShoppingCart = ({ userId }) => {
    const [items, setItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [variants, setVariants] = useState({});

    useEffect(() => {
        // Fetch cart items when component mounts
        axios.get(`/api/cart/${userId}`)
            .then(response => {
                setItems(response.data.items);
            })
            .catch(error => {
                console.error('Error fetching cart items:', error);
            });

        // Fetch available variants (color, size) for the user
        axios.get(`/api/variants`)
            .then(response => {
                setVariants(response.data);
            })
            .catch(error => {
                console.error('Error fetching available variants:', error);
            });
    }, [userId]);

    const toggleSelectAll = () => {
        setSelectAll(!selectAll);
        setItems(items.map(item => ({ ...item, selected: !selectAll })));
    };

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

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity >= 1) {
            const selectedItem = items.find(item => item.id === id);
            const availableStock = selectedItem.stock; // Assuming you have this field

            if (newQuantity <= availableStock) {
                setItems(items.map(item => 
                    item.id === id ? { ...item, quantity: newQuantity } : item
                ));
                // Update quantity in the backend
                axios.put(`/api/cart/update-quantity`, {
                    userId,
                    productId: selectedItem.productId,
                    variationId: selectedItem.variationId,
                    quantity: newQuantity
                })
                .catch(error => {
                    console.error('Error updating quantity:', error);
                });
            } else {
                alert('Not enough stock available');
            }
        }
    };

    const removeItem = (itemId) => {
        setItems(items.filter(item => item.id !== itemId));
        // Remove from backend
        axios.delete(`/api/cart/remove/${itemId}`)
            .catch(error => {
                console.error('Error removing item:', error);
            });
    };

    const selectedItemsCount = items.filter(item => item.selected).length;

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
                                            <select 
                                                defaultValue={item.color} 
                                                disabled={!variants[item.productId]?.colors?.includes(item.color)}
                                            >
                                                {variants[item.productId]?.colors?.map((color, index) => (
                                                    <option key={index} value={color}>{color}</option>
                                                ))}
                                            </select>
                                            <select 
                                                defaultValue={item.size} 
                                                disabled={!variants[item.productId]?.sizes?.includes(item.size)}
                                            >
                                                {variants[item.productId]?.sizes?.map((size, index) => (
                                                    <option key={index} value={size}>{size}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="item-quantity-cart">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                    </div>
                                    <div className="item-price">
                                        <span className="price">${(item.price * item.quantity).toFixed(2)}</span>
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
