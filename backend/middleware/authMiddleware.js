const jwt = require('jsonwebtoken')
const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")


const protect = asyncHandler(async (req, res, next) => {
  let token = null;

  if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  try {
    token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();

  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
});

module.exports = { protect };

