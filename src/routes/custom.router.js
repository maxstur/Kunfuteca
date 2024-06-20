const { Router } = require("express");
const { authToken } = require("../utils");

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
      const user = req.user;

      if (!user) {
        return res
          .status(401)
          .json({ status: "error", error: "Forbidden, not authenticated" });
      }

      // Check if the user's role is in the allowed policies
      const userRole = user.role.toUpperCase();
      if (!policies.includes(userRole) && !policies.includes("PREMIUM", "ADMIN", "USER")) {
        return res
          .status(403)
          .send({ status: "error", error: "Forbidden, not authorized" });
      }

      if (policies.includes("PUBLIC") && policies.length == 1) {
        return next();
      }

      req.user = user;
      next();
    };
  }
}

module.exports = CustomRouter;
