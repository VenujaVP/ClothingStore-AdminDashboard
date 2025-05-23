/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import './ShoppingCart.css';
import withAuth from '../withAuth';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { 
  FaShoppingCart, 
  FaCreditCard, 
  FaShieldAlt, 
  FaTrash,
  FaSpinner,
  FaChevronLeft,
  FaPlus,
  FaMinus
} from 'react-icons/fa';

const ShoppingCart = ({ userId }) => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const [updatingItems, setUpdatingItems] = useState({});
    const [processingCheckout, setProcessingCheckout] = useState(false);

    // Fetch cart items from backend
    const fetchCartItems = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8082/api/user/cart-items/${userId}`);
            
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to fetch cart items');
            }

            const itemsWithSelection = response.data.items.map(item => ({
                ...item,
                selected: true, // Default to selected for better UX
                image_url: item.image_url || 'https://via.placeholder.com/150'
            }));

            setCartItems(itemsWithSelection);
            setSelectAll(true); // Default select all items
            setError(null);
        } catch (err) {
            console.error('Error fetching cart items:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load cart');
            toast.error('Failed to load cart items');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchCartItems();
        }
    }, [userId]);

    const toggleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        setCartItems(cartItems.map(item => ({ 
            ...item, 
            selected: newSelectAll 
        })));
    };

    const toggleItemSelection = (cartItemId) => {
        const updatedItems = cartItems.map(item => 
            item.cart_item_id === cartItemId 
                ? { ...item, selected: !item.selected }
                : item
        );
        
        setCartItems(updatedItems);
        setSelectAll(updatedItems.every(item => item.selected));
    };

    // Update quantity in backend and frontend
    const updateQuantity = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            setUpdatingItems(prev => ({ ...prev, [cartItemId]: true }));
            
            const item = cartItems.find(i => i.cart_item_id === cartItemId);
            
            // First check stock availability
            const stockResponse = await axios.get(
                `http://localhost:8082/api/user/check-stock/${item.variation_id}`
            );

            if (!stockResponse.data.success || stockResponse.data.available < newQuantity) {
                toast.error(`Only ${stockResponse.data.available} units available`);
                return;
            }

            // Update quantity in backend
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

            // Update frontend state
            setCartItems(cartItems.map(item => 
                item.cart_item_id === cartItemId 
                    ? { ...item, quantity: newQuantity } 
                    : item
            ));
            
            toast.success('Quantity updated successfully');
        } catch (err) {
            console.error('Error updating quantity:', err);
            toast.error(err.response?.data?.message || 'Failed to update quantity');
        } finally {
            setUpdatingItems(prev => ({ ...prev, [cartItemId]: false }));
        }
    };

    // Remove item from backend and frontend
    const removeItem = async (cartItemId) => {
        console.log('Removing item:', cartItemId, userId);
        try {
            setUpdatingItems(prev => ({ ...prev, [cartItemId]: true }));
            
            const response = await axios.post(
                `http://localhost:8082/api/user/remove-cart-item/${userId}/${cartItemId}`
            );

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            // Update frontend state
            setCartItems(cartItems.filter(item => item.cart_item_id !== cartItemId));
            toast.success('Item removed from cart');
            
        } catch (err) {
            console.error('Error removing item:', err);
            toast.error(err.response?.data?.message || 'Failed to remove item');
        } finally {
            setUpdatingItems(prev => ({ ...prev, [cartItemId]: false }));
        }
    };

    const selectedItemsCount = cartItems.filter(item => item.selected).length;

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            return item.selected ? total + (parseFloat(item.unit_price) * item.quantity) : total;
        }, 0);
    };

    const calculateTotal = () => {
        return calculateSubtotal();
    };

    // Process checkout and navigate to pre-payment page
    const proceedToCheckout = async () => {
        try {
            setProcessingCheckout(true);
            const selectedItems = cartItems.filter(item => item.selected);
            
            if (selectedItems.length === 0) {
                toast.error('Please select at least one item');
                return;
            }

            // Format the items for the PrePaymentPage component
            const checkoutItems = selectedItems.map(item => ({
                productId: item.product_id,
                productName: item.product_name,
                variationId: item.variation_id,
                size: item.size,
                color: item.color,
                quantity: item.quantity,
                unitPrice: parseFloat(item.unit_price),
                totalPrice: parseFloat(item.unit_price) * item.quantity,
                image: item.image_url || 'https://via.placeholder.com/150',
                variationDetails: {
                    inStock: item.available_quantity > 0,
                    availableQuantity: item.available_quantity
                }
            }));

            // Navigate to the PrePaymentPage with the selected items
            navigate('/user-pre-payment-page', { state: checkoutItems });
        } catch (err) {
            console.error('Error proceeding to checkout:', err);
            toast.error('Failed to proceed to checkout. Please try again.');
        } finally {
            setProcessingCheckout(false);
        }
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
                <p>Looks like you haven't added anything to your cart yet</p>
                <button 
                    className="continue-shopping-btn"
                    onClick={() => navigate('/')}
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <button onClick={() => navigate(-1)} className="back-button">
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
                                    <div className="item-select">
                                        <input 
                                            type="checkbox"
                                            checked={item.selected}
                                            onChange={() => toggleItemSelection(item.cart_item_id)}
                                            className="item-checkbox"
                                        />
                                    </div>
                                    
                                    <div className="item-image">
                                        <img src={item.image_url} alt={item.product_name} />
                                    </div>
                                    
                                    <div className="item-details">
                                        <h3 className="item-title">{item.product_name}</h3>
                                        <p className="item-description">{item.product_description}</p>
                                        <div className="item-attributes">
                                            {item.size && (
                                                <div className="attribute">
                                                    <strong>Size:</strong> {item.size}
                                                </div>
                                            )}
                                            {item.color && (
                                                <div className="attribute">
                                                    <strong>Color:</strong> {item.color}
                                                </div>
                                            )}
                                            <div className="attribute">
                                                <strong>Stock:</strong> {item.available_quantity}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="item-controls">
                                        <div className="item-quantity-controls">
                                            <button 
                                                className="quantity-btn decrease"
                                                onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1)}
                                                disabled={item.quantity <= 1 || updatingItems[item.cart_item_id]}
                                            >
                                                <FaMinus />
                                            </button>
                                            <div className="quantity-display">
                                                {updatingItems[item.cart_item_id] ? (
                                                    <FaSpinner className="spinner" />
                                                ) : (
                                                    item.quantity
                                                )}
                                            </div>
                                            <button 
                                                className="quantity-btn increase"
                                                onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                                                disabled={updatingItems[item.cart_item_id] || item.quantity >= item.available_quantity}
                                            >
                                                <FaPlus />
                                            </button>
                                        </div>
                                        <div className="item-price-container">
                                            <div className="item-price">
                                                LKR {(parseFloat(item.unit_price) * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        className="remove-item"
                                        onClick={() => removeItem(item.cart_item_id)}
                                        disabled={updatingItems[item.cart_item_id]}
                                        title="Remove item"
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
                                onClick={proceedToCheckout}
                                disabled={selectedItemsCount === 0 || processingCheckout}
                            >
                                {processingCheckout ? (
                                    <>
                                        <FaSpinner className="spinner" /> Processing...
                                    </>
                                ) : (
                                    `Proceed to Checkout (${selectedItemsCount})`
                                )}
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