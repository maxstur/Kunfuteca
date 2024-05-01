const { Router } = require("express");
const jwt = require("jsonwebtoken");

class CustomRouter {
  constructor() {
    this.router = Router();
    this.initialize();
  }

  initialize() {} // <---Esto se sobreescribe en cada clase hija--->
  getRouter() {
    return this.router;
  }

  applyCallbacks(callbacks) {
    return callbacks.map((cb) => async (...params) => {
      //cb representa los callbacks y cuando hay => sin llaves es un return implícito!
      try {
        await cb(...params);
      } catch (error) {
        //console.log("error", error);
        params[1].status(500).send({ error: error.message });
      }
    });
  }

  addCustomResponses(req, res, next) {
    res.sendSuccess = (payload) =>
      res.status(200).send({ status: "success", payload });
    res.sendServerError = (error) =>
      res.status(500).send({ status: "error", error });
    res.sendUserError = (error) =>
      res.status(400).send({ status: "error", error });

    next();
  }

  get(path, policies, ...callbacks) {
    this.router.get(
      path,
      this.handlePolicies,
      this.addCustomResponses,
      this.applyCallbacks(callbacks)
    ); //Lo que sería: [()=>{},()=>{},(req, req)=>res.send]
  }

  post(path, policies, ...callbacks) {
    this.router.post(
      path,
      this.handlePolicies,
      this.addCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }

  put(path, policies, ...callbacks) {
    this.router.put(
      path,
      this.handlePolicies,
      this.addCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }

  delete(path, policies, ...callbacks) {
    this.router.delete(
      path,
      this.handlePolicies,
      this.addCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }

  handlePolicies(policies) {
    //ej:['admin', 'user'...etc]
    return (req, res, next) => {
      if (policies[0] == "PUBLIC" && policies.length == 1) {
        return next();
      }

      const token = this.getToken(req) //todo
      if (!token) {
        return res
          .status(403)
          .send({ status: "error", error: "Not authorized" });
      }

      const user = jwt.veryfy(token, 'secret') //{role:"ADMIN"}

      if(policies.includes(user.role.toUpperCase())){
        return res.status(403).send({status:'error', error:'Not authorized'})
      }

      req.user = user;

      next();
    };
  }

  getToken(req) {
    const authHeader = req.headers.authorization;
    if(!authHeader){
      return null
    }
    //token: bearer token caracters
    const token = authHeader.split(' ')[1]
    return token;

  }
}

module.exports = CustomRouter;
