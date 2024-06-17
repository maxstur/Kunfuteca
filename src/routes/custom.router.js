const { Router } = require("express");
const { JWT_PRIVATE_KEY } = require("../config/environment.config");
const jwt = require("jsonwebtoken");
const { getToken } = require("../utils");

class CustomRouter {
  constructor() {
    this.router = Router();
    this.initialize();
  }

  initialize() {}
  getRouter() {
    return this.router;
  }

  applyCallbacks(callbacks) {
    return callbacks.map((cb) => async (...params) => {
      try {
        await cb(...params);
      } catch (error) {
        // console.log("Error applying callback in CustomRouter", error);
        params[1].status(500).send({ error: error.message });
      }
    });
  }

  addCustomResponses(req, res, next) {
    res.sendSuccess = (payload) => {
      res.status(200).send({ status: "success", payload });
    };
    res.sendServerError = (error) => {
      res.status(500).send({ status: "error", error: error.message });
    };
    res.sendUserError = (error) => {
      res.status(400).send({ status: "error", error: error.message });
    };
    next();
  }
  get(path, policies, ...callbacks) {
    this.router.get(
      path,
      this.handlePolicies(policies),
      this.addCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }

  post(path, policies, ...callbacks) {
    this.router.post(
      path,
      this.handlePolicies(policies),
      this.addCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }

  put(path, policies, ...callbacks) {
    this.router.put(
      path,
      this.handlePolicies(policies),
      this.addCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }

  delete(path, policies, ...callbacks) {
    this.router.delete(
      path,
      this.handlePolicies(policies),
      this.addCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }

  handlePolicies(policies) {
    //Por ej: [ADMIN], [USER], [PUBLIC]...
    return (req, res, next) => {
      if (policies[0] == "PUBLIC" && policies.length == 1) {
        return next();
      }

      const token = getToken(req);
      if (!token) {
        return res
          .status(403)
          .send({ status: "error", error: "Not authorized" });
      }
      const user = jwt.verify(token, JWT_PRIVATE_KEY);

      // Check if the user's role is in the allowed policies
      if (!policies.includes(user.role.toUpperCase())) {
        return res
          .status(403)
          .send({ status: "error", error: "Forbidden, not authorized" });
      }

      // Check if the user's role is in the allowed policies
      const userRole = user.role.toUpperCase();
      if (!policies.includes(userRole) && !policies.includes("PREMIUM")) {
        return res
          .status(403)
          .send({ status: "error", error: "Forbidden, not authorized" });
      }

      req.user = user;

      next();
    };
  }
}

module.exports = CustomRouter;
