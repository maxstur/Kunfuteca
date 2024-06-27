const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = require("../config/environment.config");
const { generateToken } = require("../utils");


class SessionsController {
    static async registerUser(req, res) {
        try {const user = req.user;

        // //Token generator
        // const token = generateToken(user, JWT_PRIVATE_KEY);

        // res.cookie("rodsCookie", token, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: "Strict",
        // });

        res.send({
            status: "success",
            message: "User registered successfully",
        });

        } catch (error) {
            res.sendUserError({error: "User already exists"})
        };
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