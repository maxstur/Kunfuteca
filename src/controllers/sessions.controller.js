const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = require("../config/environment.config");

class SessionsController {
    static async register(req, res) {
        res.send({ status: "success", message: "User registered successfully" });
    }

    static async registerFail(req, res) {
        res.status(400).send({ status: "error", error: "There was an error registering the user" });
    }

    static async loginFail(req, res) {
        res.status(400).send({ status: "error", error: "There was an error logging in the user" });
    }

    
}

module.exports = SessionsController;