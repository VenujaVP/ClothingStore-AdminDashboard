import bcrypt from 'bcrypt';
import sqldb from '../config/sqldb.js';
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
                    (USERNAME, EMAIL, F_NAME, L_NAME, PASSWORD, PHONE_NUM, PHONE_NUM1, PHONE_NUM2, ENTRY_DATE, ROLE) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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

            res.status(200).json({ 
                message: "Employee created successfully", 
                employeeId: result.insertId 
            });
        });
    });
};
