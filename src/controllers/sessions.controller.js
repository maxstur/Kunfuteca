const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = require("../config/environment.config");
const { createdHash, generateToken, setTokenCookie } = require("../utils");
const userModel = require("../dao/models/users");

class SessionsController {
  static async registerUser(req, res, next) {
    try {
      const user = await userModel.create(req.body);
      res.status(201).send({
        status: "success",
        message: "User registered successfully",
        payload: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getRegisterError(req, res) {
    res.status(400).send({
      status: "error",
      error: "User already exists",
      alert: "User already exists, please login",
    });
  }
  static async login(req, res) {
    if (!req || !req.user) {
      return res.status(400).send({ error: "Failed to login" });
    }

    const { user } = req;
    const { _id, first_name, last_name, email, age, role, cart } = user;
    if (!_id || !first_name || !last_name || !email || !age || !role || !cart) {
      return res.status(400).send({ error: "Failed to login" });
    }

    const token = generateToken({
      id: _id,
      first_name,
      last_name,
      role,
      age,
      cart,
      email,
    });
    setTokenCookie(res, token);

    res.redirect("/products");

    res.send({
      status: "success",
      message: "Logged in successfully",
    });
  }

  static async getLoginError(req, res) {
    console.log("Inside getLoginError");
    console.log("Request:", req);
    console.log("Response:", res);
    res.status(400).send({
      status: "error",
      error: "Invalid credentials",
      alert: "Invalid credentials, please try again",
    });
    console.log("getLoginError completed");
  }

  static async logout(req, res) {
    res.clearCookie("authToken");
    res.redirect("/login");
    res.send({
      status: "success",
      message: "User logged out successfully",
    });
  }

  static async github(req, res) {
    const { _id, first_name, last_name, role, age, email } = req.user;
    const serializableUser = {
      id: _id,
      first_name,
      last_name,
      age: Number(age),
      email,
    };
    const token = jwt.sign(serializableUser, JWT_PRIVATE_KEY, {
      expiresIn: "1h",
    });

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    res.redirect("/products");
  }

  static async getCurrent(req, res) {
    res.json({ user: req.user });
  }

  static async getResetPassword(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        status: "error",
        error: "You sould provide right email and password",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).send({
        status: "error",
        error: "User not found",
      });
    }
    /** hasheamos la nueva contraseña */
    const hashedPassword = createdHash(password);
    const result = await userModel.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    );
    res.send({
      status: "success",
      message: "Password changed successfully",
      payload: result,
    });
  }

  static async getForgotPassword(req, res) {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send({
        status: "error",
        error: "You sould provide right email",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).send({
        status: "error",
        error: "User not found",
      });
    }
    res.send({
      status: "success",
      message: "Email sent successfully",
    });
  }
}

module.exports = SessionsController;
