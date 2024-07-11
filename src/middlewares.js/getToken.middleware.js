const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = require("../config/environment.config");

const getToken = (req, res, next) => {
    let token = req.cookies.authToken;
      jwt.verify(token, JWT_PRIVATE_KEY, (err, decoded) => {
        if (err) {
          return res
            .status(401)
            .send({ status: "error", error: "Invalid token, not authenticated" });
        }
      });
      req.user = decoded;
      next();
  };

  module.exports =  getToken