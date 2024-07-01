const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = require("../config/environment.config");
const { createdHash} = require("../utils");
const userModel = require("../dao/models/users");

class SessionsController {
  static async registerUser(req, res) {
    try {
      res.send({
        status: "success",
        message: "User registered successfully",
      });
    } catch (error) {
      res.sendUserError({ error: "User already exists" });
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
    try {
      if (!req.user) {
        throw new Error("User not found");
      }

      const { _id, first_name, last_name, email, age, role, cart } = req.user;

      const serializableUser = {
        id: _id,
        first_name,
        last_name,
        role,
        age,
        cart,
        email,
      };

      const token = jwt.sign(serializableUser, JWT_PRIVATE_KEY, {
        expiresIn: "1h",
      });
      res.cookie("rodsCookie", token, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      });

      res.send({
        status: "success",
        message: "Logged in successfully",
      });
    } catch (error) {
      console.error(error);
      res.sendUserError({ error: "Failed to login" });
    }
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
    res.clearCookie("rodsCookie");
    res.redirect("/login");
    res.send({
      status: "success",
      message: "User logged out successfully",
    });
  }

  static async github(req, res) {
    try {
      const { _id, first_name, last_name, role, age, email, cart } = req.user;
      console.log(_id, first_name, last_name, role, age, email, cart);
      const serializableUser = {
        id: _id,
        first_name: first_name || "",
        last_name: last_name || "",
        age: age || 0,
        email: email || "",
        cart: cart || [],
        role: role || "user",
      };
      console.log(serializableUser, JWT_PRIVATE_KEY);
      const token = jwt.sign(serializableUser, JWT_PRIVATE_KEY, {
        expiresIn: "1h",
      });
      console.log(token);
      res.cookie("rodsCookie", token, {
        httpOnly: true,
      });
      console.log("cookie set");
      res.redirect("/products");
    } catch (error) {
      console.error(error);
      res
        .status(error.status || 500)
        .send({ error: error.message || "Failed to login with GitHub" });
    }
  }

  static async getCurrent(req, res) {
    if (req.user) {
      try {
        const user = await userModel.findOne({ _id: req.user._id }).lean();
        res.send({ status: "success", payload: user });
      } catch (error) {
        res.sendUserError({ error: "There was a problem getting the user" });
      }
    } else {
      res.sendUserError({ error: "User not authenticated" });
    }
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
}
module.exports = SessionsController;
