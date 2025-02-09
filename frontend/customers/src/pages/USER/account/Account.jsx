/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

//Account.jsx

import React from 'react';
import './Account.css';
import withAuth from '../../withAuth';
import { FaUser, FaShoppingCart, FaCreditCard, FaUndo, FaComment, 
         FaCog, FaTruck, FaEnvelope, FaQuestionCircle, FaBell, 
         FaHeart, FaSearch } from 'react-icons/fa';

const Account = () => {
    return (
        <div className="account-page">
            {/* Left Sidebar */}
            <div className="sidebar">
                <h2 className="sidebar-title">Account</h2>
                <nav className="sidebar-nav">
                    <a href="#overview" className="nav-item active">
                        <FaUser /> Overview
                    </a>
                    <a href="#orders" className="nav-item">
                        <FaShoppingCart /> Orders
                    </a>
                    <a href="#payment" className="nav-item">
                        <FaCreditCard /> Payment
                    </a>
                    <a href="#refund" className="nav-item">
                        <FaUndo /> Refund and Return
                    </a>
                    <a href="#feedback" className="nav-item">
                        <FaComment /> Feedback
                    </a>
                    <a href="#settings" className="nav-item">
                        <FaCog /> Settings
                    </a>
                    <a href="#shipping" className="nav-item">
                        <FaTruck /> Shipping Address
                    </a>
                    <a href="#messages" className="nav-item">
                        <FaEnvelope /> Message Center
                    </a>
                    <a href="#help" className="nav-item">
                        <FaQuestionCircle /> Help Center
                    </a>
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="main-content">
                {/* User Section */}
                <div className="user-section">
                    <div className="user-info">
                        <div className="profile-image">
                            <img src="profile-placeholder.jpg" alt="Profile" />
                        </div>
                        <div className="user-details">
                            <h2>vartemenilal user</h2>
                            <div className="user-actions">
                                <a href="#wishlist" className="action-link">
                                    <FaHeart /> Wish List
                                </a>
                                <a href="#notifications" className="action-link">
                                    <FaBell /> Notifications
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Orders Section */}
                    <div className="orders-section">
                        <div className="orders-header">
                            <h3>My Orders</h3>
                            <a href="#viewall" className="view-all">View All</a>
                        </div>
                        <div className="order-status-cards">
                            <div className="status-card">
                                <span className="status-number">0</span>
                                <span className="status-text">Unpaid</span>
                            </div>
                            <div className="status-card">
                                <span className="status-number">2</span>
                                <span className="status-text">To be Shipped</span>
                            </div>
                            <div className="status-card">
                                <span className="status-number">1</span>
                                <span className="status-text">Shipped</span>
                            </div>
                            <div className="status-card">
                                <span className="status-number">3</span>
                                <span className="status-text">To be Reviewed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const AuthenticatedAccount = withAuth(Account);  
export default AuthenticatedAccount;