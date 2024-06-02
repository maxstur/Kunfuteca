const { Router } = require("express");
const { JWT_PRIVATE_KEY } = require("../config/config");
const jwt = require("jsonwebtoken");

class CustomRouter {
  constructor() {
    this.router = Router();
    this.inizialize();
  }

  inizialize() {}
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
  get(path, policies, ...callback) {
    this.router.get(
      path,
      this.handlePolicies(policies),
      this.addCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }

  post(path, policies, ...callback) {
    this.router.post(
      path,
      this.handlePolicies(policies),
      this.addCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }

  put(path, policies, ...callback) {
    this.router.put(
      path,
      this.handlePolicies(policies),
      this.addCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }

  delete(path, policies, ...callback) {
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

      const token = this.getToken(req);
      if (!token) {
        return res
          .status(403)
          .send({ status: "error", error: "Forbidden, not authorized" });
      }

      const user = jwt.verify(token, JWT_PRIVATE_KEY);

      if (!policies.includes(user.role.toUpperCase())) {
        return res
          .status(403)
          .send({ status: "error", error: "Forbidden, not authorized" });
      }

      req.user = user;

      next();
    };
  }

  getToken(req) {
    const headersToken = req.headers.authorization;

    if (!headersToken) {
      return null;
    }

    const token = headersToken.split(" ")[1];
    return token;
  }
}

module.exports = CustomRouter;
