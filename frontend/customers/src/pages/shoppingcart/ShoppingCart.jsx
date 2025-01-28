

import React from 'react';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import './ShoppingCart.css';

const ShoppingCart = () => {
    const [cartItems, setCartItems] = React.useState([
        {
            id: 1,
            name: "Cotton T-Shirt",
            price: 29.99,
            quantity: 2,
            image: "tshirt-image-url.jpg",
            size: "M"
        },
        // Add more items as needed
    ]);

    const updateQuantity = (id, change) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + change) }
                    : item
            )
        );
    };

    const removeItem = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    return (
        <div className="cart-page">
            <div className="cart-container">
                <div className="cart-header">
                    <h1>Shopping Cart</h1>
                    <span>{cartItems.length} Items</span>
                </div>

                <div className="cart-content">
                    <div className="cart-items">
                        {cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                <div className="item-image">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="item-details">
                                    <h3>{item.name}</h3>
                                    <p className="item-size">Size: {item.size}</p>
                                    <div className="quantity-controls">
                                        <button onClick={() => updateQuantity(item.id, -1)}>
                                            <FaMinus />
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)}>
                                            <FaPlus />
                                        </button>
                                    </div>
                                </div>
                                <div className="item-price">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                                <button 
                                    className="remove-btn"
                                    onClick={() => removeItem(item.id)}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
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
                </div>
            </div>
        </div>
    );
};

export default ShoppingCart;