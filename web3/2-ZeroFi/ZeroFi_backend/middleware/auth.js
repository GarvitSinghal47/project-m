const User = require("../models/user");
const { jwtSecret } = require("../config/keys");
const jwt = require("jsonwebtoken");

/**
 * A middleware to check user authentication
 */
const authRequired = async (req, res, next) => {
  const header = req.header("Authorization");
  if (!header) {
    return res.status(401).json({
      message: "Please Provide JWT",
    });
  }
  const token = header.replace("Bearer", "").trim();
  try {
    const decoded = await jwt.verify(token, jwtSecret);
    if (!decoded) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    const user = await User.findById(decoded._id);
    req.token = token;
    req.user = user;
    res.locals.user = user;
    next();
  } catch (e) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = { authRequired };
