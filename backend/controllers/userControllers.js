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