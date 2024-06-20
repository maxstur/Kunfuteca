const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = require("../config/environment.config");

class SessionsController {
    static async registerUser(req, res) {
        res.send({
            status: "success",
            message: "User registered successfully",
        });
    }

    static async getRegisterError(req, res) {
        res.status(400).send({
            status: "error",
            error: "User already exists",
            alert: "User already exists, please login",
        });
    }
}

module.exports = SessionsController