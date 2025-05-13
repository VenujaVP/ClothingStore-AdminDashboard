import bcrypt from 'bcrypt';
import sqldb from '../config/sqldb.js';
import nodemailer from 'nodemailer';

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

export const ownerCreateProduct = async (req, res) => {
  console.log('Received request to create product:', req.body);
  try {
    // Extract form data from req.body
    const {
      product_id,
      product_name,
      product_description,
      unit_price,
      date_added,
      shipping_weight,
      category1,
      category2,
      category3,
      material,
      fabric_type,
      return_policy,
      product_variations,
    } = req.body;

    // Parse product_variations if it's a string
    const variations = typeof product_variations === 'string'
      ? JSON.parse(product_variations)
      : product_variations;

    // Validation for empty fields
    if (!product_id || !product_name || !unit_price || !date_added || !category1 || !variations) {
      return res.status(400).json({ message: 'All required fields are missing' });
    }

    if (!Array.isArray(variations) || variations.length === 0) {
      return res.status(400).json({ message: 'At least one product variation is required' });
    }

    // Insert product into SQL database
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
        return res.status(500).json({ message: 'Error inserting product into the database' });
      }

      // Insert product variations
      const insertVariationQuery = `
        INSERT INTO product_variations 
          (ProductID, SizeID, ColorID, units)
        VALUES (?, ?, ?, ?)
      `;

      let variationsProcessed = 0;
      const totalVariations = variations.length;

      variations.forEach((variation) => {
        const { size, color, units } = variation;

        // Get SizeID
        const getSizeIDQuery = 'SELECT SizeID FROM sizes WHERE SizeValue = ?';
        sqldb.query(getSizeIDQuery, [size], (err, sizeResult) => {
          if (err) {
            console.error('Error fetching SizeID:', err);
            return res.status(500).json({ message: 'Error fetching SizeID' });
          }

          if (!sizeResult[0]?.SizeID) {
            console.error(`Size '${size}' not found`);
            return res.status(400).json({ message: `Size '${size}' not found in sizes table` });
          }

          const SizeID = sizeResult[0].SizeID;

          // Get ColorID
          const getColorIDQuery = 'SELECT ColorID FROM colors WHERE ColorValue = ?';
          sqldb.query(getColorIDQuery, [color], (err, colorResult) => {
            if (err) {
              console.error('Error fetching ColorID:', err);
              return res.status(500).json({ message: 'Error fetching ColorID' });
            }

            if (!colorResult[0]?.ColorID) {
              console.error(`Color '${color}' not found`);
              return res.status(400).json({ message: `Color '${color}' not found in colors table` });
            }

            const ColorID = colorResult[0].ColorID;

            // Insert the variation
            const variationValues = [product_id, SizeID, ColorID, units];

            sqldb.query(insertVariationQuery, variationValues, (err, variationResult) => {
              if (err) {
                console.error('Error inserting variation:', err);
                return res.status(500).json({ message: 'Error inserting variation into the database' });
              }

              variationsProcessed += 1;

              // Check if all variations are processed
              if (variationsProcessed === totalVariations) {
                // Handle image uploads to MongoDB if files exist
                if (req.files && req.files.length > 0) {
                  connectToDatabase().then(({ db }) => {
                    const imagesCollection = db.collection('product_images');

                    const imagesToInsert = req.files.map((file, index) => ({
                      product_id,
                      image_name: file.originalname,
                      image_data: file.buffer.toString('base64'),
                      content_type: file.mimetype,
                      uploaded_at: new Date(),
                      is_primary: index === 0,
                      order: index + 1,
                    }));

                    imagesCollection.insertMany(imagesToInsert, (err) => {
                      if (err) {
                        console.error('Error inserting images:', err);
                        return res.status(500).json({ message: 'Error inserting images' });
                      }

                      // Success response
                      res.status(200).json({
                        message: 'Product, variations, and images added successfully',
                        Status: 'success',
                      });
                    });
                  }).catch((err) => {
                    console.error('Error connecting to MongoDB:', err);
                    res.status(500).json({ message: 'Error connecting to MongoDB' });
                  });
                } else {
                  // Success response without images
                  res.status(200).json({
                    message: 'Product and variations added successfully',
                    Status: 'success',
                  });
                }
              }
            });
          });
        });
      });
    });
  } catch (error) {
    console.error('Error in product creation:', error);
    res.status(500).json({
      message: error.message || 'Error processing product creation',
      error: error,
    });
  }
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