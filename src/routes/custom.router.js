const { Router } = require("express");
const { authToken } = require("../utils");
const { JWT_PRIVATE_KEY, EMAIL_ADMIN_1, EMAIL_ADMIN_2, EMAIL_ADMIN_3 } = require("../config/environment.config");

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
    res.sendUserError = (error) => {
      res.status(400).send({ status: "error", error: error.message });
    };
    res.sendUserSuccess = (payload) => {
      res.status(200).send({ status: "success", payload });
    };
    res.sendServerError = (error) => {
      res.status(500).send({ status: "error", error: error.message });
    };
    res.sendServerSuccess = (payload) => {
      res.status(200).send({ status: "success", payload });
    }
    res.sendNotFound = (error) => {
      res.status(404).send({ status: "error", error: error.message });
    };
    res.sendForbiddenAccess = (error) => {
      res.status(403).send({ status: "error", error: error.message });
    };
    res.sendUserUnauthorized = (error) => {
      res.status(401).send({ status: "error", error: error.message });
    };

    next();
  }

  handlePolicies(policies) {
    //Por ej: [ADMIN], [USER], [PUBLIC]...
    return (req, res, next) => {
      const user = req.user;

      if (policies.includes("PUBLIC") && policies.length == 1) {
        return next();
      }

      if (!user) {
        return res
          .status(401)
          .json({ status: "error", error: "Forbidden, not authenticated" });
      }

      // Check if the user's role is in the allowed policies
      const userRole = user.role.toUpperCase();

      // Check if user role is in the allowed policies
      if (!policies.includes(userRole)) {
        return res
          .status(403)
          .send({ status: "error", error: "Forbidden, not authorized" });
      }

      req.user = user;
      next();
    };
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
}

module.exports = CustomRouter;
