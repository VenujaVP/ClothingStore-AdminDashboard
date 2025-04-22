//routes/userRoutes.js

import express from 'express';
import { 
    searchProducts, 
    filterProducts, 
    fetchProductDetails, 
    addToCart, 
    fetchCartItems, 
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
// Update cart item quantity
router.put('/update-cart-item', updateCartItem);

// Remove item from cart
router.delete('/remove-cart-item/:userId/:cartItemId', removeCartItem);

// Check stock availability
router.get('/check-stock/:variationId', checkStock);


export default router;
