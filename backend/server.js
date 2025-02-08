//server.js

// to run - npm start

//npm init -y - Initialize the Backend
//"start": "nodemon server.js","dev": "nodemon server.js" - meekth dnn packace.json eke sctipt nodemon active krnn
//"type": "module", - main eken phlt dnn package.json wlt

//npm i -D nodemon ->developer depemdancy

// npm install mysql2 dotenv bcrypt jsonwebtoken express cors cookie-parser mongoose
//npm install express-validator for validations = for Parameterized Queries:
//npm install nodemailer


import sqldb from './config/sqldb.js'
import authRoutes from './routes/authRoutes.js'
import verifyUser from './middleware/authMiddleware.js';
import forgotPasswordRoutes from './routes/forgotPasswordRoutes.js';
import cleanupExpiredTokens from './services/tokenCleanup.js';

import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();


// Create Express app -----------------------------------------act as your HTTP server
const app = express();

app.use(express.json());  //--------------------------Parses incoming JSON request bodies and makes the data accessible

// Middleware
app.use(cors({          //---------------------------------Allows requests from different origins
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET"],
    credentials: true   //-----------------------------------allows the browser to send cookies and authentication credentials
}));
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/forgot-password', forgotPasswordRoutes); 

app.get('/tokenverification', verifyUser, (req, res) => {
    return res.status(200).json({ Status: "Success", name: req.name });
});

// Run token cleanup every 5 minutes
setInterval(async () => {
    await cleanupExpiredTokens();
}, 5 * 60 * 1000);
// Runs every 5 minutes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));