import jwt from 'jsonwebtoken';

const verifyUser = (req, res, next) => {
    const token = req.cookies.token; // Retrieve token from cookies
    if (!token) {
        return res.status(401).json({ Error: "No token provided" }); // Unauthorized
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ Error: "Invalid token" }); // Forbidden
        }

        req.name = decoded.name; // Attach user data to the request
        next(); // Proceed to the next middleware/route
    });
};

export default verifyUser;
