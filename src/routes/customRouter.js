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

  get(path, ...callback) {
    this.router.get(path, this.applyCallbacks(callbacks));
  }

  applyCallbacks(callbacks) {
    return callbacks.map(cb => async (...params) => {
      try {
        await cb(...params);
      } catch (error) {
        params[1].status(500).send({ error: error.message });
      }
    });
  }
    
}

module.exports = CustomRouter;
