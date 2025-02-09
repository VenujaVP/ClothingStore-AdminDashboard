// verifyUser.js
import jwt from 'jsonwebtoken';

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ Status: "Error", message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ Status: "Error", message: "Invalid token" });
        }

        req.name = decoded.name;
        next();
    });
};

export default verifyUser;
