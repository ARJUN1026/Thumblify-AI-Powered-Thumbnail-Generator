const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    // extract authHeader from req.headers.authorization
    // if missing or not starting with "Bearer " → 401 "Unauthorized"
    // extract token from authHeader
    // jwt.verify token with JWT_SECRET → decoded
    // find user by decoded.id, select("-password")
    // if no user → 401 "User not found"
    // attach user to req.user → call next()
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    // return 401 "Invalid token"
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

module.exports = authMiddleware;
