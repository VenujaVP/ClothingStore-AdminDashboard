import bcrypt from 'bcrypt';
import sqldb from '../config/sqldb.js';
import nodemailer from 'nodemailer';
import { connectToDatabase } from '../config/mongodb.js';

// import { validateEmail, validatePhoneNumber, validateRole } from './validations';  // Import validation functions

const saltRounds = 10;

export const ownerCreateEmployee = (req, res) => {
    const { employee_uname, email, f_name, l_name, password, com_password, phone_1, phone_2, entry_date, role } = req.body;

    // Validation for empty fields
    if (!employee_uname || !email || !f_name || !l_name || !password || !com_password || !phone_1 || !role || !entry_date) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Validation for password mismatch
    if (password !== com_password) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash the password
    bcrypt.hash(password, saltRounds, (err, passwordHash) => {
        if (err) {
            console.error("Error hashing password:", err);
            return res.status(500).json({ message: "Error hashing password" });
        }

        // SQL query to insert a new employee into the database
        const sql = `INSERT INTO EmployeeDetails 
                    (USERNAME, EMAIL, F_NAME, L_NAME, PASSWORD, PHONE_NUM1, PHONE_NUM2, ENTRY_DATE, ROLE) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            employee_uname, // employee_uname
            email,          // email
            f_name,         // f_name
            l_name,         // l_name
            passwordHash,   // password (hashed)
            phone_1,        // phone_1
            phone_2,        // phone_2
            entry_date,     // entry_date
            role            // role
        ];

        // Execute the SQL query
        sqldb.query(sql, values, (err, result) => {
            if (err) {
                console.error("Error inserting data:", err);
                return res.status(500).json({ message: "Error inserting data into the database" });
            }

            console.log("Employee added successfully");

            // Step 1: Create a Nodemailer transporter
            const transporter = nodemailer.createTransport({
                service: 'gmail', // Use your email service (e.g., Gmail, Outlook)
                auth: {
                    user: process.env.EMAIL_USER, // Your email address
                    pass: process.env.EMAIL_PASS, // Your email password or app password
                }
            });

            // Step 2: Define email content
            const mailOptions = {
                from: process.env.EMAIL_USER, // Sender email address
                to: email, // Recipient email address (employee's email)
                subject: 'Your Employee Account Details', // Email subject
                // You can also use `html` for a more visually appealing email
                html: `
                    <h1>Hello ${f_name} ${l_name},</h1>
                    <p>Your employee account has been successfully created. Below are your login details:</p>
                    <ul>
                        <li><strong>Username:</strong> ${employee_uname}</li>
                        <li><strong>Email:</strong> ${email}</li>
                        <li><strong>Password:</strong> ${password}</li>
                    </ul>
                    <p>Please use these credentials to log in to your account.</p>
                    <p>Best regards,<br>Your Company Name</p>
                `
            };

            // Step 3: Send the email
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error("Error sending email:", err);
                    return res.status(500).json({ 
                        message: "Employee created successfully, but failed to send email", 
                        Status: "Success" 
                    });
                }

                console.log("Email sent:", info.response);

                // Step 4: Send success response
                res.status(200).json({ 
                    message: "Employee created successfully and email sent", 
                    Status: "Success"
                });
            });
        });
    });
};

export const ownerAddExpenses = (req, res) => {
    const { expenses_id, date, expenses_name, cost, description } = req.body;
  
    // SQL query to insert a new expense into the database
    const sql = `INSERT INTO Expenses 
                (expenses_id, date, expenses_name, cost, description) 
                VALUES (?, ?, ?, ?, ?)`;
  
    const values = [
      expenses_id,    // expenses_id
      date,           // date
      expenses_name,  // expenses_name
      cost,           // cost
      description     // description
    ];
  
    // Execute the SQL query
    sqldb.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
  
        // Handle duplicate entry error (e.g., duplicate expenses_id)
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: "Expense ID already exists" });
        }
  
        return res.status(500).json({ message: "Error inserting data into the database" });
      }
  
      console.log("Expense added successfully");
  
      // Send success response
      res.status(200).json({ 
        message: "Expense added successfully", 
        Status: "Success"
      });
    });
};

export const fetchSizes = (req, res) => {
    const sql = 'SELECT * FROM sizes'; // Query to fetch all sizes
    // Execute the query
    sqldb.query(sql, (err, result) => {
      if (err) {
        console.error('Error fetching sizes:', err);
        return res.status(500).json({ message: 'Error fetching sizes' });
      }
  
      // Send the sizes as a response
      res.status(200).json(result);
    });
};

export const fetchColors = (req, res) => {
    const sql = 'SELECT * FROM colors'; // Query to fetch all colors
  
    // Execute the query
    sqldb.query(sql, (err, result) => {
      if (err) {
        console.error('Error fetching colors:', err);
        return res.status(500).json({ message: 'Error fetching colors' });
      }
  
      // Send the colors as a response
      res.status(200).json(result);
    });
};

export const ownerCreateProduct = async (req, res) => {
  console.log('Received request to create product');
  console.log('Files received:', req.files ? req.files.length : 'No files');
  console.log('Body:', req.body);
  
  try {
    // Parse product_variations from JSON if it's a string
    if (req.body.product_variations && typeof req.body.product_variations === 'string') {
      try {
        req.body.product_variations = JSON.parse(req.body.product_variations);
      } catch (parseError) {
        console.error('Error parsing product_variations JSON:', parseError);
        return res.status(400).json({
          message: 'Invalid product_variations format',
          Status: 'error'
        });
      }
    }

    // Extract form data from req.body
    const {
      product_id,
      product_name,
      product_description,
      unit_price,
      date_added,
      shipping_weight,
      total_units,
      category1,
      category2,
      category3,
      material,
      fabric_type,
      return_policy,
      product_variations,
    } = req.body;

    // Validate product_variations - require at least one variation
    if (!Array.isArray(product_variations) || product_variations.length === 0) {
      return res.status(400).json({ 
        message: 'At least one product variation is required',
        Status: 'error'
      });
    }

    // Validation for empty fields
    if (!product_id || !product_name || !unit_price || !date_added || !category1) {
      return res.status(400).json({ 
        message: 'All required fields are missing',
        Status: 'error'
      });
    }

    // Handle image uploads if files are present
    const uploadedImages = [];
    if (req.files && req.files.length > 0) {
      try {
        console.log(`Processing ${req.files.length} images for product ID: ${product_id}`);
        const { db } = await connectToDatabase();
        const productImagesCollection = db.collection('product_images');
        
        // Process each image file
        for (let i = 0; i < req.files.length; i++) {
          const file = req.files[i];
          
          // Convert image buffer to Base64 string
          const imageBase64 = file.buffer.toString('base64');
          
          // Create image document
          const imageDoc = {
            product_id: product_id,
            image_name: file.originalname,
            image_data: imageBase64,
            content_type: file.mimetype,
            uploaded_at: new Date(),
            is_primary: i === 0, // First image is primary by default
            order: i + 1
          };
          
          // Insert image document to MongoDB
          const result = await productImagesCollection.insertOne(imageDoc);
          console.log(`Image ${i+1} uploaded with ID: ${result.insertedId}`);
          
          // Add to uploaded images list (without storing the actual image data in response)
          uploadedImages.push({
            id: result.insertedId,
            name: file.originalname,
            is_primary: imageDoc.is_primary,
            order: imageDoc.order
          });
        }
        
        console.log(`Successfully uploaded ${uploadedImages.length} images to MongoDB`);
      } catch (imgError) {
        console.error('Error uploading images to MongoDB:', imgError);
        // Don't return here, continue with product creation even if image upload fails
      }
    }

    // Insert product into product_table
    const insertProductQuery = `
      INSERT INTO product_table 
        (ProductID, ProductName, ProductDescription, UnitPrice, DateAdded, ShippingWeight, Category1, Category2, Category3, Material, FabricType, ReturnPolicy)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const productValues = [
      product_id,
      product_name,
      product_description || null,
      unit_price,
      date_added,
      shipping_weight || null,
      category1,
      category2 || null,
      category3 || null,
      material || null,
      fabric_type || null,
      return_policy || null,
    ];

    // Execute SQL product insertion
    sqldb.query(insertProductQuery, productValues, (err, productResult) => {
      if (err) {
        console.error('Error inserting product:', err);
        return res.status(500).json({ 
          message: 'Error inserting product into the database',
          error: err.message,
          Status: 'error'
        });
      }

      console.log('Product base data inserted successfully');
      
      // Create an array to track successful variations
      let successfulVariations = [];
      let failedVariations = [];
      
      // Define the recursive function to process variations one by one
      const processVariation = (index) => {
        // Base case: all variations processed
        if (index >= product_variations.length) {
          console.log(`Processed all ${product_variations.length} variations`);
          
          // Check if at least one variation was successful
          if (successfulVariations.length > 0) {
            console.log(`Successfully added ${successfulVariations.length} variations`);
            return res.status(200).json({
              message: 'Product and variations added successfully',
              Status: 'success',
              successCount: successfulVariations.length,
              failCount: failedVariations.length,
              uploadedImages: uploadedImages.length > 0 ? uploadedImages : []
            });
          } else {
            // If no variations were successful, consider it a failure
            console.error('No variations were successfully added');
            return res.status(500).json({
              message: 'Product was added but all variations failed',
              errors: failedVariations,
              Status: 'error',
              uploadedImages: uploadedImages.length > 0 ? uploadedImages : []
            });
          }
        }

        const { size, color, units } = product_variations[index];
        console.log(`Processing variation ${index + 1}/${product_variations.length}: Size=${size}, Color=${color}, Units=${units}`);

        // Step 1: Get SizeID
        sqldb.query('SELECT SizeID FROM sizes WHERE SizeValue = ?', [size], (sizeErr, sizeResult) => {
          if (sizeErr) {
            console.error('Error fetching SizeID:', sizeErr);
            failedVariations.push({ 
              index: index,
              size: size,
              color: color,
              error: `Error fetching SizeID: ${sizeErr.message}`
            });
            return processVariation(index + 1); // Continue with next variation
          }

          if (!sizeResult || sizeResult.length === 0) {
            console.error(`Size "${size}" not found in database`);
            failedVariations.push({
              index: index,
              size: size,
              color: color,
              error: `Size "${size}" not found in database`
            });
            return processVariation(index + 1); // Continue with next variation
          }

          const SizeID = sizeResult[0].SizeID;
          console.log(`Found SizeID for "${size}": ${SizeID}`);

          // Step 2: Get ColorID
          sqldb.query('SELECT ColorID FROM colors WHERE ColorValue = ?', [color], (colorErr, colorResult) => {
            if (colorErr) {
              console.error('Error fetching ColorID:', colorErr);
              failedVariations.push({
                index: index,
                size: size,
                color: color,
                error: `Error fetching ColorID: ${colorErr.message}`
              });
              return processVariation(index + 1); // Continue with next variation
            }

            if (!colorResult || colorResult.length === 0) {
              console.error(`Color "${color}" not found in database`);
              failedVariations.push({
                index: index,
                size: size,
                color: color,
                error: `Color "${color}" not found in database`
              });
              return processVariation(index + 1); // Continue with next variation
            }

            const ColorID = colorResult[0].ColorID;
            console.log(`Found ColorID for "${color}": ${ColorID}`);

            // Step 3: Insert the variation
            const insertVariationQuery = `
              INSERT INTO product_variations 
                (ProductID, SizeID, ColorID, units)
              VALUES (?, ?, ?, ?)
            `;
            
            sqldb.query(insertVariationQuery, [product_id, SizeID, ColorID, units], (variationErr, variationResult) => {
              if (variationErr) {
                console.error(`Error inserting variation ${index + 1}:`, variationErr);
                failedVariations.push({
                  index: index,
                  size: size,
                  color: color,
                  error: `Error inserting variation: ${variationErr.message}`
                });
              } else {
                console.log(`Variation ${index + 1} added successfully with ID: ${variationResult.insertId}`);
                successfulVariations.push({
                  index: index,
                  size: size,
                  color: color,
                  units: units,
                  id: variationResult.insertId
                });
              }
              
              // Process the next variation regardless of success/failure
              processVariation(index + 1);
            });
          });
        });
      };

      // Start processing from the first variation
      processVariation(0);
    });
  } catch (error) {
    console.error('Error in product creation:', error);
    res.status(500).json({
      message: error.message || 'Error processing product creation',
      error: error.toString(),
      Status: 'error'
    });
  }
};

export const getProductImages = async (req, res) => {
  try {
    const { productId } = req.params;
    
    if (!productId) {
      return res.status(400).json({
        message: 'Product ID is required',
        Status: 'error'
      });
    }
    
    // Connect to MongoDB
    const { db } = await connectToDatabase();
    const productImagesCollection = db.collection('product_images');
    
    // Find images for the product
    const images = await productImagesCollection.find({ 
      product_id: productId 
    }).sort({ 
      is_primary: -1, // Primary images first
      order: 1        // Then by order
    }).toArray();
    
    // Return images (with or without image data depending on query param)
    const includeData = req.query.includeData === 'true';
    
    const formattedImages = images.map(img => ({
      id: img._id,
      product_id: img.product_id,
      image_name: img.image_name,
      content_type: img.content_type,
      uploaded_at: img.uploaded_at,
      is_primary: img.is_primary,
      order: img.order,
      // Only include image data if requested
      ...(includeData && { image_data: img.image_data })
    }));
    
    res.status(200).json({
      status: 'success',
      count: formattedImages.length,
      images: formattedImages
    });
  } catch (error) {
    console.error('Error fetching product images:', error);
    res.status(500).json({
      message: 'Error fetching product images',
      error: error.message,
      Status: 'error'
    });
  }
};

export const getProductWithImages = async (req, res) => {
  try {
    const { productId } = req.params;
    
    if (!productId) {
      return res.status(400).json({
        message: 'Product ID is required',
        Status: 'error'
      });
    }
    
    // Step 1: Get product details from SQL database
    const getProductQuery = `
      SELECT p.*,
        (SELECT SUM(units) FROM product_variations WHERE ProductID = p.ProductID) as TotalStock
      FROM product_table p
      WHERE p.ProductID = ?
    `;
    
    sqldb.query(getProductQuery, [productId], async (err, productResult) => {
      if (err) {
        console.error('Error fetching product from SQL:', err);
        return res.status(500).json({
          message: 'Error fetching product details',
          error: err.message,
          Status: 'error'
        });
      }
      
      if (!productResult || productResult.length === 0) {
        return res.status(404).json({
          message: 'Product not found',
          Status: 'error'
        });
      }
      
      const product = productResult[0];
      
      // Step 2: Get product variations
      const getVariationsQuery = `
        SELECT v.*, s.SizeValue, c.ColorValue 
        FROM product_variations v
        JOIN sizes s ON v.SizeID = s.SizeID
        JOIN colors c ON v.ColorID = c.ColorID
        WHERE v.ProductID = ?
      `;
      
      sqldb.query(getVariationsQuery, [productId], async (varErr, variationsResult) => {
        if (varErr) {
          console.error('Error fetching product variations:', varErr);
          return res.status(500).json({
            message: 'Error fetching product variations',
            error: varErr.message,
            Status: 'error'
          });
        }
        
        // Step 3: Get product images from MongoDB
        try {
          const { db } = await connectToDatabase();
          const productImagesCollection = db.collection('product_images');
          
          // Find images for the product
          const images = await productImagesCollection.find({ 
            product_id: productId 
          }).sort({ 
            is_primary: -1, // Primary images first
            order: 1        // Then by order
          }).toArray();
          
          console.log(`Found ${images.length} images for product ${productId}`);
          
          // Format image data - exclude actual binary data to keep response smaller
          const formattedImages = images.map(img => ({
            id: img._id,
            image_name: img.image_name,
            content_type: img.content_type,
            is_primary: img.is_primary,
            order: img.order,
            // Create a URL to access this image (assuming you'll create this endpoint)
            image_url: `/api/products/images/${img._id}`
          }));
          
          // Combine all data into a single response
          res.status(200).json({
            Status: 'success',
            product: {
              ...product,
              variations: variationsResult || [],
              images: formattedImages || []
            }
          });
          
        } catch (mongoErr) {
          console.error('Error fetching product images from MongoDB:', mongoErr);
          // Still return product data even if image fetch fails
          res.status(200).json({
            Status: 'success',
            product: {
              ...product,
              variations: variationsResult || [],
              images: [],
              image_error: 'Failed to fetch product images'
            }
          });
        }
      });
    });
    
  } catch (error) {
    console.error('Error in getProductWithImages:', error);
    res.status(500).json({
      message: 'Error fetching product with images',
      error: error.message,
      Status: 'error'
    });
  }
};