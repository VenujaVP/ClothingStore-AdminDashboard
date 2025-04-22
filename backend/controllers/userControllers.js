//conrrollers/userControllers.js
import sqldb from '../config/sqldb.js';

  export const searchProducts = async (req, res) => {
    const { query } = req.body; // Get the search query from the request body
  
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
  
    try {
      // Query to search for products by name, description, or categories
      const searchProductsQuery = `
        SELECT 
          p.ProductID AS product_id,
          p.ProductName AS product_name,
          p.ProductDescription AS product_description,
          p.UnitPrice AS unit_price,
          p.FinalRating AS rating,
          p.WishlistCount AS wishlist_count,
          SUM(v.units) AS total_units
        FROM product_table p
        LEFT JOIN product_variations v ON p.ProductID = v.ProductID
        WHERE 
          p.ProductName LIKE ? OR 
          p.ProductDescription LIKE ? OR
          p.Category1 LIKE ? OR
          p.Category2 LIKE ? OR
          p.Category3 LIKE ?
        GROUP BY p.ProductID
      `;
  
      // Add wildcards for partial matching
      const searchTerm = `%${query}%`;
  
      // Execute the query
      sqldb.query(
        searchProductsQuery,
        [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm], // Pass searchTerm for all fields
        (err, results) => {
          if (err) {
            console.error('Error searching products:', err);
            return res.status(500).json({ message: 'Error searching products in the database' });
          }
  
          // Format the response
          const products = results.map((row) => ({
            product_id: row.product_id,
            product_name: row.product_name,
            product_description: row.product_description,
            unit_price: row.unit_price,
            rating: row.rating,
            wishlist_count: row.wishlist_count,
            total_units: row.total_units || 0, // Default to 0 if no units are available
          }));
  
          // Send the response
          res.status(200).json({ 
            message: 'Search results fetched successfully', 
            products: products 
          });
        }
      );
    } catch (err) {
      console.error('Error in searchProducts:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  export const filterProducts = async (req, res) => {
    const { cat1, cat2, cat3 } = req.body; // Get the category filters from the request body
  
    if (!cat1 && !cat2 && !cat3) {
      return res.status(400).json({ message: 'At least one category filter is required' });
    }
  
    try {
      // Build the WHERE clause dynamically based on the provided filters
      let whereClause = '';
      const queryParams = [];
  
      if (cat1) {
        whereClause += 'Category1 = ?';
        queryParams.push(cat1);
      }
      if (cat2) {
        if (whereClause) whereClause += ' AND ';
        whereClause += 'Category2 = ?';
        queryParams.push(cat2);
      }
      if (cat3) {
        if (whereClause) whereClause += ' AND ';
        whereClause += 'Category3 = ?';
        queryParams.push(cat3);
      }
  
      // Query to filter products based on the dynamic WHERE clause
      const filterProductsQuery = `
        SELECT 
          p.ProductID AS product_id,
          p.ProductName AS product_name,
          p.ProductDescription AS product_description,
          p.UnitPrice AS unit_price,
          p.FinalRating AS rating,
          p.WishlistCount AS wishlist_count,
          SUM(v.units) AS total_units
        FROM product_table p
        LEFT JOIN product_variations v ON p.ProductID = v.ProductID
        WHERE ${whereClause}
        GROUP BY p.ProductID
      `;
  
      // Execute the query
      sqldb.query(
        filterProductsQuery,
        queryParams, // Pass the dynamic query parameters
        (err, results) => {
          if (err) {
            console.error('Error filtering products:', err);
            return res.status(500).json({ message: 'Error filtering products in the database' });
          }
  
          // Format the response
          const products = results.map((row) => ({
            product_id: row.product_id,
            product_name: row.product_name,
            product_description: row.product_description,
            unit_price: row.unit_price,
            rating: row.rating,
            wishlist_count: row.wishlist_count,
            total_units: row.total_units || 0, // Default to 0 if no units are available
          }));
  
          // Send the response
          res.status(200).json({ 
            message: 'Filtered products fetched successfully', 
            products: products 
          });
        }
      );
    } catch (err) {
      console.error('Error in filterProducts:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  export const fetchProducts = async (req, res) => {
    try {
      // Query to fetch product details and total units
      const fetchProductsQuery = `
        SELECT 
          p.ProductID AS product_id,
          p.ProductName AS product_name,
          p.ProductDescription AS product_description,
          p.UnitPrice AS unit_price,
          p.FinalRating AS rating,
          p.WishlistCount AS wishlist_count,
          SUM(v.units) AS total_units
        FROM product_table p
        LEFT JOIN product_variations v ON p.ProductID = v.ProductID
        GROUP BY p.ProductID
      `;
  
      // Execute the query
      sqldb.query(fetchProductsQuery, (err, results) => {
        if (err) {
          console.error('Error fetching products:', err);
          return res.status(500).json({ message: 'Error fetching products from the database' });
        }
  
        // Format the response
        const products = results.map((row) => ({
          product_id: row.product_id,
          product_name: row.product_name,
          product_description: row.product_description,
          unit_price: row.unit_price,
          rating: row.rating,
          wishlist_count: row.wishlist_count,
          total_units: row.total_units || 0, // Default to 0 if no units are available
        }));
  
        // Send the response
        res.status(200).json({ 
          message: 'Products fetched successfully', 
          products: products 
        });
      });
    } catch (err) {
      console.error('Error in fetchProducts:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  export const fetchProductDetails = (req, res) => {
      const { productId } = req.params;
      console.log('Fetching details for product ID:', productId);
  
      // 1. Fetch main product details
      sqldb.query(
          `SELECT 
              p.*,
              GROUP_CONCAT(DISTINCT c.ColorValue) AS colors,
              GROUP_CONCAT(DISTINCT s.SizeValue) AS sizes
          FROM 
              product_table p
          LEFT JOIN 
              product_variations pv ON p.ProductID = pv.ProductID
          LEFT JOIN 
              colors c ON pv.ColorID = c.ColorID
          LEFT JOIN 
              sizes s ON pv.SizeID = s.SizeID
          WHERE 
              p.ProductID = ?
          GROUP BY 
              p.ProductID`,
          [productId],
          (err, productRows) => {
              if (err) {
                  console.error('Error fetching product:', err);
                  return res.status(500).json({
                      success: false,
                      message: 'Database error',
                      error: err.message
                  });
              }
  
              if (productRows.length === 0) {
                  return res.status(404).json({
                      success: false,
                      message: 'Product not found'
                  });
              }
  
              const product = productRows[0];
  
              // 2. Fetch variations with inventory
              sqldb.query(
                  `SELECT 
                      pv.VariationID,
                      s.SizeValue AS size,
                      c.ColorValue AS color,
                      pv.units AS quantity,
                      pv.units > 0 AS in_stock
                  FROM 
                      product_variations pv
                  JOIN 
                      sizes s ON pv.SizeID = s.SizeID
                  JOIN 
                      colors c ON pv.ColorID = c.ColorID
                  WHERE 
                      pv.ProductID = ?`,
                  [productId],
                  (err, variations) => {
                      if (err) {
                          console.error('Error fetching variations:', err);
                          return res.status(500).json({
                              success: false,
                              message: 'Database error',
                              error: err.message
                          });
                      }
  
                      // 3. Fetch images (placeholder - implement your actual image table)
                      const imageUrls = [
                          'https://via.placeholder.com/500',
                          'https://via.placeholder.com/500'
                      ];
  
                      // 4. Prepare response
                      const responseData = {
                          success: true,
                          product: {
                              product_id: product.ProductID,
                              product_name: product.ProductName,
                              product_description: product.ProductDescription,
                              unit_price: product.UnitPrice,
                              original_price: product.UnitPrice * 1.2, // Example markup
                              material: product.Material,
                              fabric_type: product.FabricType,
                              shipping_weight: product.ShippingWeight,
                              return_policy: product.ReturnPolicy,
                              wishlist_count: product.WishlistCount,
                              rating: product.FinalRating || 0,
                              total_units: variations.reduce((sum, v) => sum + v.quantity, 0),
                              main_image: imageUrls[0],
                              image_urls: imageUrls,
                              variations: variations,
                              sizes: product.sizes ? product.sizes.split(',') : [],
                              colors: product.colors ? product.colors.split(',') : [],
                              Category1: product.Category1,
                              Category2: product.Category2,
                              Category3: product.Category3
                          }
                      };
  
                      res.json(responseData);
                      // console.log('Product details fetched successfully:', responseData);
                  }
              );
          }
      );
  };

  export const addToCart = (req, res) => {
    console.log('Adding item to cart:', req.body);
    const { userId, item } = req.body;
    const { productId, variationId, quantity } = item;

    if (!userId || !productId || !variationId || !quantity) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields (userId, productId, variationId, quantity)'
        });
    }

    // 1. Check product variation and stock
    sqldb.query(
        `SELECT units FROM product_variations WHERE VariationID = ? AND units >= ?`,
        [variationId, quantity],
        (err, variationResults) => {
            if (err) {
                console.error('DB Error (variation check):', err);
                return res.status(500).json({ success: false, message: 'Database error', error: err.message });
            }

            if (!variationResults || variationResults.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Product variation not found or insufficient stock'
                });
            }

            // 2. Check if item already exists in cart
            sqldb.query(
                `SELECT cart_item_id FROM cart_items WHERE customerID = ? AND ProductID = ? AND VariationID = ?`,
                [userId, productId, variationId],
                (err, existingItemResults) => {
                    if (err) {
                        console.error('DB Error (check existing cart):', err);
                        return res.status(500).json({ success: false, message: 'Database error', error: err.message });
                    }

                    if (existingItemResults.length > 0) {
                        // 3A. Update the quantity (replace old quantity)
                        const cartItemId = existingItemResults[0].cart_item_id;

                        sqldb.query(
                            `UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?`,
                            [quantity, cartItemId],
                            (err, updateResult) => {
                                if (err) {
                                    console.error('DB Error (update cart quantity):', err);
                                    return res.status(500).json({ success: false, message: 'Database error', error: err.message });
                                }

                                return res.status(200).json({
                                    success: true,
                                    message: 'Cart item quantity updated successfully'
                                });
                            }
                        );
                    } else {
                        // 3B. Insert new item into cart
                        sqldb.query(
                            `INSERT INTO cart_items (customerID, ProductID, VariationID, quantity) VALUES (?, ?, ?, ?)`,
                            [userId, productId, variationId, quantity],
                            (err, insertResult) => {
                                if (err) {
                                    console.error('DB Error (insert cart item):', err);
                                    return res.status(500).json({ success: false, message: 'Database error', error: err.message });
                                }

                                return res.status(201).json({
                                    success: true,
                                    message: 'Item added to cart successfully'
                                });
                            }
                        );
                    }
                }
            );
        }
    );
};

//------------------------------------------------------------------------------

export const fetchCartItems = (req, res) => {
  const { userId } = req.params;

  sqldb.query(
      `SELECT 
          ci.cart_item_id,
          ci.quantity,
          ci.added_at,
          ci.updated_at,
          pt.ProductID,
          pt.ProductName,
          pt.ProductDescription,
          pt.UnitPrice,
          pv.VariationID,
          s.SizeValue AS size,
          c.ColorValue AS color,
          pv.units AS available_quantity
       FROM cart_items ci
       JOIN product_table pt ON ci.ProductID = pt.ProductID
       JOIN product_variations pv ON ci.VariationID = pv.VariationID
       JOIN sizes s ON pv.SizeID = s.SizeID
       JOIN colors c ON pv.ColorID = c.ColorID
       WHERE ci.customerID = ?`,
      [userId],
      (err, results) => {
          if (err) {
              console.error('Database error:', err);
              return res.status(500).json({
                  success: false,
                  message: 'Failed to fetch cart items',
                  error: err.message
              });
          }

          const items = results.map(item => ({
              cart_item_id: item.cart_item_id,
              quantity: item.quantity,
              added_at: item.added_at,
              updated_at: item.updated_at,
              product_id: item.ProductID,
              product_name: item.ProductName,
              product_description: item.ProductDescription,
              unit_price: item.UnitPrice,
              variation_id: item.VariationID,
              size: item.size,
              color: item.color,
              available_quantity: item.available_quantity
          }));
          console.log('Fetched cart items:', items);
          return res.status(200).json({
              success: true,
              items: items
          });
      }
  );
};

export const updateCartItem = (req, res) => {
  const { userId, cartItemId, quantity } = req.body;

  // First verify ownership
  sqldb.query(
      'SELECT customerID FROM cart_items WHERE cart_item_id = ?',
      [cartItemId],
      (err, results) => {
          if (err) {
              console.error('Database error:', err);
              return res.status(500).json({
                  success: false,
                  message: 'Failed to verify cart item ownership',
                  error: err.message
              });
          }

          if (!results[0] || results[0].customerID !== parseInt(userId)) {
              return res.status(403).json({
                  success: false,
                  message: 'You do not have permission to modify this item'
              });
          }

          // Update quantity
          sqldb.query(
              'UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?',
              [quantity, cartItemId],
              (err, updateResults) => {
                  if (err) {
                      console.error('Database error:', err);
                      return res.status(500).json({
                          success: false,
                          message: 'Failed to update cart item',
                          error: err.message
                      });
                  }

                  return res.status(200).json({
                      success: true,
                      message: 'Cart item updated successfully'
                  });
              }
          );
      }
  );
};

export const removeCartItem = (req, res) => {
  const { userId, cartItemId } = req.params;
  console.log('Removing item from cart:', req.params);

  // Verify ownership first
  sqldb.query(
      'SELECT customerID FROM cart_items WHERE cart_item_id = ?',
      [cartItemId],
      (err, results) => {
          if (err) {
              console.error('Database error:', err);
              return res.status(500).json({
                  success: false,
                  message: 'Failed to verify cart item ownership',
                  error: err.message
              });
          }

          if (!results[0] || results[0].customerID !== parseInt(userId)) {
              return res.status(403).json({
                  success: false,
                  message: 'You do not have permission to remove this item'
              });
          }

          // Delete the item
          sqldb.query(
              'DELETE FROM cart_items WHERE cart_item_id = ?',
              [cartItemId],
              (err, deleteResults) => {
                  if (err) {
                      console.error('Database error:', err);
                      return res.status(500).json({
                          success: false,
                          message: 'Failed to remove cart item',
                          error: err.message
                      });
                  }

                  return res.status(200).json({
                      success: true,
                      message: 'Item removed from cart successfully'
                  });
              }
          );
      }
  );
};

export const checkStock = (req, res) => {
  const { variationId } = req.params;

  sqldb.query(
      'SELECT units FROM product_variations WHERE VariationID = ?',
      [variationId],
      (err, results) => {
          if (err) {
              console.error('Database error:', err);
              return res.status(500).json({
                  success: false,
                  message: 'Failed to check stock',
                  error: err.message
              });
          }

          if (!results[0]) {
              return res.status(404).json({
                  success: false,
                  message: 'Product variation not found'
              });
          }

          return res.status(200).json({
              success: true,
              available: results[0].units
          });
      }
  );
};

//------------------------------------------------------------------------------

export const addUserAddress = (req, res) => {
  const {
    customerID,
    contact_name,
    mobile_number,
    street_address,
    apt_suite_unit,
    province,
    district,
    zip_code,
    is_default
  } = req.body;

  console.log('Adding new shipping address:', req.body);

  // Basic validation
  if (!customerID || !contact_name || !mobile_number || !street_address || !province || !district || !zip_code) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields'
    });
  }

  // First check if we need to update existing default addresses
  if (is_default) {
    sqldb.query(
      'UPDATE addresses SET is_default = FALSE WHERE customerID = ?',
      [customerID],
      (err, updateResults) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            message: 'Failed to update existing default addresses',
            error: err.message
          });
        }

        // Proceed with inserting the new address
        insertNewAddress();
      }
    );
  } else {
    // Insert directly if not setting as default
    insertNewAddress();
  }

  function insertNewAddress() {
    sqldb.query(
      `INSERT INTO addresses (
        customerID,
        contact_name,
        mobile_number,
        street_address,
        apt_suite_unit,
        province,
        district,
        zip_code,
        is_default
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customerID,
        contact_name,
        mobile_number,
        street_address,
        apt_suite_unit || null,
        province,
        district,
        zip_code,
        is_default || false
      ],
      (err, insertResults) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            message: 'Failed to add shipping address',
            error: err.message
          });
        }

        return res.status(201).json({
          success: true,
          message: 'Shipping address added successfully',
          address_id: insertResults.insertId
        });
      }
    );
  }
};

// Get all addresses for a user
export const getUserAddresses = (req, res) => {
  const { userId } = req.params;

  sqldb.query(
      `SELECT * FROM addresses WHERE customerID = ? ORDER BY is_default DESC, address_id DESC`,
      [userId],
      (err, results) => {
          if (err) {
              console.error('Database error:', err);
              return res.status(500).json({
                  success: false,
                  message: 'Failed to fetch addresses',
                  error: err.message
              });
          }

          return res.status(200).json({
              success: true,
              addresses: results
          });
      }
  );
};

// Delete an address
export const deleteUserAddress = (req, res) => {
  const { userId, addressId } = req.params;

  // First verify ownership
  sqldb.query(
      'SELECT customerID FROM addresses WHERE address_id = ?',
      [addressId],
      (err, results) => {
          if (err) {
              console.error('Database error:', err);
              return res.status(500).json({
                  success: false,
                  message: 'Failed to verify address ownership',
                  error: err.message
              });
          }

          if (!results[0] || results[0].customerID !== parseInt(userId)) {
              return res.status(403).json({
                  success: false,
                  message: 'You do not have permission to delete this address'
              });
          }

          // Delete the address
          sqldb.query(
              'DELETE FROM addresses WHERE address_id = ?',
              [addressId],
              (err, deleteResults) => {
                  if (err) {
                      console.error('Database error:', err);
                      return res.status(500).json({
                          success: false,
                          message: 'Failed to delete address',
                          error: err.message
                      });
                  }

                  return res.status(200).json({
                      success: true,
                      message: 'Address deleted successfully'
                  });
              }
          );
      }
  );
};

