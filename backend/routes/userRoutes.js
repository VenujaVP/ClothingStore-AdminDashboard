//routes/userRoutes.js

import express from 'express';
import { 
    searchProducts, 
    filterProducts, 
    fetchProductDetails, 
    addToCart, 
    fetchCartItems,
    updateCartItem,
    removeCartItem,
    checkStock,
    addUserAddress,
    getUserAddresses,
    deleteUserAddress
    } from '../controllers/userControllers.js';

const router = express.Router();

// router.get('/product-fetch', fetchProducts);
router.post('/product-search', searchProducts);
router.post('/category-filter', filterProducts);

router.get('/fetch-product-details/:productId', fetchProductDetails);
router.post('/add-to-cart', addToCart);

// Cart endpoints
router.post('/add-to-cart', addToCart);

router.get('/cart-items/:userId', fetchCartItems);
router.put('/update-cart-item', updateCartItem);  // Update cart item quantity
router.post('/remove-cart-item/:userId/:cartItemId', removeCartItem);  // Remove item from cart
router.get('/check-stock/:variationId', checkStock); // Check stock availability


router.post('/shipping-address', addUserAddress);
router.get('/addresses/:userId', getUserAddresses);  // Get all addresses for a user
router.delete('/address/:userId/:addressId', deleteUserAddress);  // Delete an address


export default router;
