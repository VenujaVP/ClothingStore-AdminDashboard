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

    // Validate required fields
    if (!userId || !productId || !variationId || !quantity) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields (userId, productId, variationId, quantity)'
        });
    }

    // 1. Verify product variation exists and has sufficient stock
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
                `SELECT cart_item_id, quantity FROM cart_items WHERE customerID = ? AND ProductID = ? AND VariationID = ?`,
                [userId, productId, variationId],
                (err, existingItemResults) => {
                    if (err) {
                        console.error('DB Error (existing cart item check):', err);
                        return res.status(500).json({ success: false, message: 'Database error', error: err.message });
                    }

                    if (existingItemResults && existingItemResults.length > 0) {
                        // 3A. Update the existing quantity
                        const existingQuantity = existingItemResults[0].quantity;
                        const newQuantity = existingQuantity + quantity;

                        // Optional: check new quantity doesn't exceed stock
                        const availableUnits = variationResults[0].units;
                        if (newQuantity > availableUnits) {
                            return res.status(400).json({
                                success: false,
                                message: 'Updated quantity exceeds available stock'
                            });
                        }

                        sqldb.query(
                            `UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?`,
                            [newQuantity, existingItemResults[0].cart_item_id],
                            (err, updateResult) => {
                                if (err) {
                                    console.error('DB Error (updating cart item):', err);
                                    return res.status(500).json({ success: false, message: 'Database error', error: err.message });
                                }

                                return res.status(200).json({
                                    success: true,
                                    message: 'Cart item quantity updated successfully'
                                });
                            }
                        );
                    } else {
                        // 3B. Add new item to cart
                        sqldb.query(
                            `INSERT INTO cart_items (customerID, ProductID, VariationID, quantity) VALUES (?, ?, ?, ?)`,
                            [userId, productId, variationId, quantity],
                            (err, insertResult) => {
                                if (err) {
                                    console.error('DB Error (insert cart item):', err);
                                    return res.status(500).json({ success: false, message: 'Database error', error: err.message });
                                }

                                // 4. Return success response
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
