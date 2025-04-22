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
    const [availableVariations, setAvailableVariations] = useState({});

    // Fetch cart items for logged in user
    const fetchCartItems = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8082/api/user/cart-items/${userId}`);
            
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to fetch cart items');
            }

            const itemsWithSelection = response.data.items.map(item => ({
                ...item,
                selected: false
            }));

            setCartItems(itemsWithSelection);
            fetchAvailableVariations(response.data.items);
            
        } catch (err) {
            console.error('Error fetching cart items:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchCartItems();
        }
    }, [userId]);

    // Fetch available variations for each product in cart
    const fetchAvailableVariations = async (items) => {
        try {
            const variationsMap = {};
            const productIds = [...new Set(items.map(item => item.ProductID))];
            
            for (const productId of productIds) {
                const response = await axios.get(
                    `http://localhost:8082/api/user/product-variations/${productId}`
                );
                
                if (response.data.success) {
                    variationsMap[productId] = response.data.variations;
                }
            }
            
            setAvailableVariations(variationsMap);
        } catch (err) {
            console.error('Error fetching variations:', err);
            toast.error('Failed to load product variations');
        }
    };

    // Toggle select all items
    const toggleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        setCartItems(cartItems.map(item => ({ ...item, selected: newSelectAll })));
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
            
            // Check stock first
            const item = cartItems.find(i => i.cart_item_id === cartItemId);
            const stockResponse = await axios.get(
                `http://localhost:8082/api/user/check-stock/${item.VariationID}`
            );

            if (!stockResponse.data.success || stockResponse.data.available < newQuantity) {
                toast.error(`Only ${stockResponse.data.available} units available`);
                return;
            }

            // Update quantity in backend
            const updateResponse = await axios.put(
                'http://localhost:8082/api/user/update-cart-item',
                { userId, cartItemId, quantity: newQuantity }
            );

            if (!updateResponse.data.success) {
                throw new Error(updateResponse.data.message);
            }

            // Update local state
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

    // Update variation (size/color)
    const updateVariation = async (cartItemId, newVariationId) => {
        try {
            setUpdatingItems(prev => ({ ...prev, [cartItemId]: true }));
            
            const response = await axios.put(
                'http://localhost:8082/api/user/update-cart-variation',
                { userId, cartItemId, variationId: newVariationId }
            );

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            // Update local state with new variation details
            const updatedItem = response.data.updatedItem;
            setCartItems(cartItems.map(item => 
                item.cart_item_id === cartItemId 
                    ? { ...item, ...updatedItem, selected: item.selected }
                    : item
            ));
            
            toast.success('Product variation updated');
            
        } catch (err) {
            console.error('Error updating variation:', err);
            toast.error(err.response?.data?.message || 'Failed to update variation');
        } finally {
            setUpdatingItems(prev => ({ ...prev, [cartItemId]: false }));
        }
    };

    // Proceed to checkout
    const proceedToCheckout = () => {
        const selectedItems = cartItems.filter(item => item.selected);
        if (selectedItems.length === 0) {
            toast.error('Please select items to checkout');
            return;
        }

        const orderData = {
            items: selectedItems.map(item => ({
                cartItemId: item.cart_item_id,
                productId: item.ProductID,
                productName: item.ProductName,
                variationId: item.VariationID,
                size: item.Size,
                color: item.Color,
                quantity: item.quantity,
                unitPrice: item.UnitPrice,
                image: item.image_url,
                availableQuantity: item.available_quantity
            })),
            subtotal: calculateSubtotal(),
            total: calculateTotal()
        };

        // Navigate to checkout page
        console.log('Proceeding to checkout with:', orderData);
        // navigate('/checkout', { state: orderData });
        toast.success(`Proceeding to checkout with ${selectedItems.length} items`);
    };

    // Calculate selected items count
    const selectedItemsCount = cartItems.filter(item => item.selected).length;

    // Calculate totals
    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            return item.selected ? total + (item.UnitPrice * item.quantity) : total;
        }, 0);
    };

    const calculateTotal = () => {
        return calculateSubtotal(); // Add shipping, taxes, discounts if needed
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
                <button className="retry-btn" onClick={fetchCartItems}>
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
                <p>Looks like you haven ' t added anything to your cart yet</p>
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
                            {cartItems.map(item => {
                                const variations = availableVariations[item.ProductID] || [];
                                const currentVariation = variations.find(v => v.VariationID === item.VariationID);
                                const availableSizes = [...new Set(variations.map(v => v.Size))];
                                const availableColors = [...new Set(variations.map(v => v.Color))];
                                
                                return (
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
                                            <img 
                                                src={item.image_url || 'https://via.placeholder.com/100'} 
                                                alt={item.ProductName} 
                                            />
                                        </div>
                                        
                                        <div className="item-details">
                                            <h3>{item.ProductName}</h3>
                                            <div className="item-options">
                                                {/* Size Selector */}
                                                <select
                                                    value={currentVariation?.Size || ''}
                                                    onChange={(e) => {
                                                        const newSize = e.target.value;
                                                        const newVariation = variations.find(v => 
                                                            v.Size === newSize && 
                                                            v.Color === currentVariation?.Color
                                                        );
                                                        if (newVariation) {
                                                            updateVariation(item.cart_item_id, newVariation.VariationID);
                                                        }
                                                    }}
                                                    disabled={updatingItems[item.cart_item_id]}
                                                >
                                                    {availableSizes.map(size => (
                                                        <option 
                                                            key={size} 
                                                            value={size}
                                                            disabled={!variations.some(v => 
                                                                v.Size === size && 
                                                                v.Color === currentVariation?.Color &&
                                                                v.in_stock
                                                            )}
                                                        >
                                                            {size}
                                                        </option>
                                                    ))}
                                                </select>
                                                
                                                {/* Color Selector */}
                                                <select
                                                    value={currentVariation?.Color || ''}
                                                    onChange={(e) => {
                                                        const newColor = e.target.value;
                                                        const newVariation = variations.find(v => 
                                                            v.Color === newColor && 
                                                            v.Size === currentVariation?.Size
                                                        );
                                                        if (newVariation) {
                                                            updateVariation(item.cart_item_id, newVariation.VariationID);
                                                        }
                                                    }}
                                                    disabled={updatingItems[item.cart_item_id]}
                                                >
                                                    {availableColors.map(color => (
                                                        <option 
                                                            key={color} 
                                                            value={color}
                                                            disabled={!variations.some(v => 
                                                                v.Color === color && 
                                                                v.Size === currentVariation?.Size &&
                                                                v.in_stock
                                                            )}
                                                        >
                                                            {color}
                                                        </option>
                                                    ))}
                                                </select>
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
                                                disabled={updatingItems[item.cart_item_id]}
                                            >
                                                +
                                            </button>
                                        </div>
                                        
                                        <div className="item-price">
                                            <span className="price">
                                                LKR {(item.UnitPrice * item.quantity).toFixed(2)}
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
                                );
                            })}
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
                                onClick={proceedToCheckout}
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