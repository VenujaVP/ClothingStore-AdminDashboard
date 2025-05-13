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