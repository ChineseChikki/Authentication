const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

function authMiddleware(req, res, next) {
  //GETS THE AUTH TOKEN FROM THE REQ HEADER
  const token = req.headers.authorization;
  try {
    //verifies the token
    const decoded = jwt.verify(token, secretKey);
    res.locals.email = decoded.email;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      res.status(403).json({ status: "failed", message: "Invalid token" });
    } else if (error.name === "TokenExpiredError") {
      res.status(401).json({ status: "failed", message: "Token expired" });
    } else {
      res.status(400).json({ status: "failed", message: "Bad request" });
    }
  }
}

module.exports = {
  authMiddleware,
};
