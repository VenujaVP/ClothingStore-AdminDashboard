//routes/userRoutes.js

import express from 'express';
import { 
    searchProducts, 
    filterProducts, 
    fetchProductDetails, 
    addToCart, 
    fetchCartItems,
    // updateCartItem,
    // updateCartVariation,
    // removeCartItem,
    // checkStock,
    // getProductVariations 
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
// router.put('/update-cart-item', updateCartItem);
// // router.put('/update-cart-variation', updateCartVariation);
// router.delete('/remove-cart-item/:userId/:cartItemId', removeCartItem);
// router.get('/check-stock/:variationId', checkStock);

// // Product endpoints
// router.get('/product-variations/:productId', getProductVariations);

export default router;
