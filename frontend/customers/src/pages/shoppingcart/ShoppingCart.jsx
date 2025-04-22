/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import './ShoppingCart.css';
import withAuth from '../withAuth';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FaShoppingCart, 
  FaCreditCard, 
  FaShieldAlt, 
  FaTrash,
  FaSpinner,
  FaChevronLeft
} from 'react-icons/fa';

const ShoppingCart = ({ userId }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const [updatingItems, setUpdatingItems] = useState({});

    // Fetch cart items for logged in user
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8082/api/user/cart-items/${userId}`);
                
                if (!response.data.success) {
                    throw new Error(response.data.message || 'Failed to fetch cart items');
                }

                const itemsWithSelection = response.data.items.map(item => ({
                    ...item,
                    selected: false,
                    image_url: item.image_url || 'https://via.placeholder.com/150'
                }));

                setCartItems(itemsWithSelection);
                
            } catch (err) {
                console.error('Error fetching cart items:', err);
                setError(err.response?.data?.message || err.message || 'Failed to load cart');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchCartItems();
        }
    }, [userId]);

    // Toggle select all items
    const toggleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        setCartItems(cartItems.map(item => ({ 
            ...item, 
            selected: newSelectAll 
        }));
    };

    // Toggle individual item selection
    const toggleItemSelection = (cartItemId) => {
        const updatedItems = cartItems.map(item => 
            item.cart_item_id === cartItemId 
                ? { ...item, selected: !item.selected }
                : item
        );
        
        setCartItems(updatedItems);
        setSelectAll(updatedItems.every(item => item.selected));
    };

    // Update item quantity
    const updateQuantity = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            setUpdatingItems(prev => ({ ...prev, [cartItemId]: true }));
            
            const item = cartItems.find(i => i.cart_item_id === cartItemId);
            const stockResponse = await axios.get(
                `http://localhost:8082/api/user/check-stock/${item.variation_id}`
            );

            if (!stockResponse.data.success || stockResponse.data.available < newQuantity) {
                toast.error(`Only ${stockResponse.data.available} units available`);
                return;
            }

            const updateResponse = await axios.put(
                'http://localhost:8082/api/user/update-cart-item',
                {
                    userId,
                    cartItemId,
                    quantity: newQuantity
                }
            );

            if (!updateResponse.data.success) {
                throw new Error(updateResponse.data.message);
            }

            setCartItems(cartItems.map(item => 
                item.cart_item_id === cartItemId 
                    ? { ...item, quantity: newQuantity } 
                    : item
            ));
            
        } catch (err) {
            console.error('Error updating quantity:', err);
            toast.error(err.response?.data?.message || 'Failed to update quantity');
        } finally {
            setUpdatingItems(prev => ({ ...prev, [cartItemId]: false }));
        }
    };

    // Remove item from cart
    const removeItem = async (cartItemId) => {
        try {
            setUpdatingItems(prev => ({ ...prev, [cartItemId]: true }));
            
            const response = await axios.delete(
                `http://localhost:8082/api/user/remove-cart-item/${userId}/${cartItemId}`
            );

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            setCartItems(cartItems.filter(item => item.cart_item_id !== cartItemId));
            toast.success('Item removed from cart');
            
        } catch (err) {
            console.error('Error removing item:', err);
            toast.error(err.response?.data?.message || 'Failed to remove item');
        } finally {
            setUpdatingItems(prev => ({ ...prev, [cartItemId]: false }));
        }
    };

    // Calculate selected items count
    const selectedItemsCount = cartItems.filter(item => item.selected).length;

    // Calculate totals
    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            return item.selected ? total + (parseFloat(item.unit_price) * item.quantity) : total;
        }, 0);
    };

    const calculateTotal = () => {
        return calculateSubtotal();
    };

    if (loading) {
        return (
            <div className="cart-loading">
                <FaSpinner className="spinner" />
                <p>Loading your cart...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="cart-error">
                <p>{error}</p>
                <button className="retry-btn" onClick={() => window.location.reload()}>
                    Retry
                </button>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="empty-cart">
                <FaShoppingCart className="empty-cart-icon" />
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added anything to your cart yet</p>
                <button 
                    className="continue-shopping-btn"
                    onClick={() => window.location.href = '/'}
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <button onClick={() => window.history.back()} className="back-button">
                <FaChevronLeft /> Continue Shopping
            </button>

            <div className="cart-container">
                <div className="cart-header">
                    <h1><FaShoppingCart /> Your Cart ({cartItems.length})</h1>
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
                    <div className="cart-items-section">
                        <div className="cart-items">
                            {cartItems.map(item => (
                                <div 
                                    key={item.cart_item_id} 
                                    className={`cart-item ${item.selected ? 'selected' : ''}`}
                                >
                                    <input 
                                        type="checkbox"
                                        checked={item.selected}
                                        onChange={() => toggleItemSelection(item.cart_item_id)}
                                    />
                                    
                                    <div className="item-image">
                                        <img src={item.image_url} alt={item.product_name} />
                                    </div>
                                    
                                    <div className="item-details">
                                        <h3>{item.product_name}</h3>
                                        <p className="item-description">{item.product_description}</p>
                                        <div className="item-attributes">
                                            <div className="attribute">
                                                <strong>Size:</strong> {item.size}
                                            </div>
                                            <div className="attribute">
                                                <strong>Color:</strong> {item.color}
                                            </div>
                                            <div className="attribute">
                                                <strong>Stock:</strong> {item.available_quantity}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="item-quantity">
                                        <button 
                                            onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1)}
                                            disabled={item.quantity <= 1 || updatingItems[item.cart_item_id]}
                                        >
                                            -
                                        </button>
                                        <span>
                                            {updatingItems[item.cart_item_id] ? (
                                                <FaSpinner className="spinner" />
                                            ) : (
                                                item.quantity
                                            )}
                                        </span>
                                        <button 
                                            onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                                            disabled={updatingItems[item.cart_item_id] || item.quantity >= item.available_quantity}
                                        >
                                            +
                                        </button>
                                    </div>
                                    
                                    <div className="item-price">
                                        <span className="price">
                                            LKR {(parseFloat(item.unit_price) * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                    
                                    <button 
                                        className="remove-item"
                                        onClick={() => removeItem(item.cart_item_id)}
                                        disabled={updatingItems[item.cart_item_id]}
                                    >
                                        {updatingItems[item.cart_item_id] ? (
                                            <FaSpinner className="spinner" />
                                        ) : (
                                            <FaTrash />
                                        )}
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
                                <span>LKR {calculateSubtotal().toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="summary-total">
                                <span>Total</span>
                                <span>LKR {calculateTotal().toFixed(2)}</span>
                            </div>
                            <button 
                                className="checkout-btn"
                                onClick={() => {
                                    const selectedItems = cartItems.filter(item => item.selected);
                                    console.log('Proceeding to checkout with:', selectedItems);
                                    toast.success(`Proceeding to checkout with ${selectedItems.length} items`);
                                }}
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
                            <p>Buyer Protection: Full refund if item is not as described</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const AuthenticatedShoppingCart = withAuth(ShoppingCart);
export default AuthenticatedShoppingCart;