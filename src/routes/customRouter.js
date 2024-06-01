const { Router } = require("express");

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

  handlePolicies(policies) {//Por ej: ADMIN, USER, PUBLIC...
    return (req, res, next) => {
      if (policies.includes(req.user.role)) {
        next();
      } else {
        res.status(403).send({ status: "error", error: "Forbidden" });
      }
    

      next();
    };
  }
}

module.exports = CustomRouter;
