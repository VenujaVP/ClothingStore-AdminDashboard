//import './ShoppingCart.css';
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState } from 'react';
import './ShoppingCart.css';
import { FaShoppingCart, FaCreditCard, FaShieldAlt, FaStore } from 'react-icons/fa';

const ShoppingCart = () => {
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
        // Add more items as needed
    ]);

    const [selectAll, setSelectAll] = useState(false);

    const toggleSelectAll = () => {
        setSelectAll(!selectAll);
        setItems(items.map(item => ({ ...item, selected: !selectAll })));
    };

    const updateQuantity = (id, newQuantity) => {
        setItems(items.map(item => 
            item.id === id ? { ...item, quantity: newQuantity } : item
        ));
    };

    const calculateTotal = () => {
        return items.reduce((total, item) => {
            if (item.selected) {
                return total + (item.price * item.quantity * (1 - item.discount/100));
            }
            return total;
        }, 0);
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

                <div className="cart-items">
                    {items.map(item => (
                        <div key={item.id} className="cart-item">
                            <input 
                                type="checkbox"
                                checked={item.selected}
                                onChange={() => {/* Handle selection */}}
                            />
                            <div className="item-image">
                                <img src={item.image} alt={item.name} />
                            </div>
                            <div className="item-details">
                                <h3>{item.name}</h3>
                                <p className="seller"><FaStore /> {item.seller}</p>
                                <div className="item-options">
                                    <select defaultValue={item.color}>
                                        <option>White</option>
                                        <option>Black</option>
                                    </select>
                                    <select defaultValue={item.size}>
                                        <option>S</option>
                                        <option>M</option>
                                        <option>L</option>
                                    </select>
                                </div>
                            </div>
                            <div className="item-quantity">
                                <button onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                            </div>
                            <div className="item-price">
                                <span className="price">${item.price}</span>
                                <span className="discount">-{item.discount}%</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <div className="summary-details">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="summary-total">
                            <span>Total</span>
                            <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                        <button className="checkout-btn">Proceed to Checkout</button>
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
    );
};

export default ShoppingCart;
