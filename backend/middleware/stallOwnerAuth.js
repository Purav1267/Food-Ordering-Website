import jwt from "jsonwebtoken";

const stallOwnerAuth = (req, res, next) => {
    const token = req.header("token");
    if (!token) {
        return res.json({ success: false, message: "No token found" });
    }
    try {
        const decoded = jwt.verify(token, "jwt_secret_key");
        req.userId = decoded.id;
        req.stallName = decoded.stallName;
        next();
    } catch (error) {
        res.json({ success: false, message: "Invalid token" });
    }
};

export default stallOwnerAuth;

