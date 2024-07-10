const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = require("../config/environment.config");
const {
  createdHash,
  generateToken,
  setTokenCookie,
  isValidPassword,
} = require("../utils");
const {
  EMAIL_ADMIN_1,
  EMAIL_ADMIN_2,
  EMAIL_ADMIN_3,
} = require("../config/environment.config");
const userModel = require("../dao/models/user");

class SessionsController {
  static async registerUser(req, res, next) {
    try {
      const { first_name, last_name, email, age, password } = req.body;

      if (!first_name || !last_name || !email || !password || !age) {
        return res.status(400).send({
          status: "error",
          message: "All fields are required",
          alert: "All fields are required",
        });
      }

      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        console.log("User already exists");
        return res.status(400).send({
          status: "error",
          message: "User already exists",
          alert: "User already exists, please login",
        });
      }

      // const role =
      //   email === EMAIL_ADMIN_1 ||
      //   email === EMAIL_ADMIN_2 ||
      //   email === EMAIL_ADMIN_3
      //     ? "admin"
      //     : "user";

      const newUser = await userModel.create({
        first_name,
        last_name,
        email,
        age,
        password: createdHash(password),
        role,
        cart: [],
      });

      console.log("User created:", newUser);

      res.status(201).send({
        status: "success",
        message: "User registered successfully",
        payload: newUser,
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
    console.log("Login attempt for", req.body.email);
    try {
      // const { email, password } = req.body;
      const user = await userModel.findOne({ email: req.body.email });
      console.log("User found:", user ? user.email : "No");

      if (!user /**|| !isValidPassword(user, req.body.password)*/) {
        console.log("User not found");
        return res
          .status(401)
          .send({ status: "error", message: "Invalid credentials" });
      }

      const validPassword = isValidPassword(user, req.body.password);
      console.log("Password valid:", validPassword ? "Yes" : "No");

      if (!validPassword) {
        console.log("Invalid password");
        return res
          .status(401)
          .send({ status: "error", message: "Invalid credentials" });
      }

      console.log("Login successful");

      const token = generateToken(user);

      res.cookie("authToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      res.status(200).send({
        status: "success",
        message: "Login successful",
        redirectUrl: "/products",
      });
    } catch (error) {
      console.log("Error logging in:", error);
      res.status(500).send({
        status: "error",
        message: "Error logging in",
        error: error.message,
      });
    }
  }

  // static async login(req, res) {
  //   try {
  //     const { _id, first_name, last_name, role, age, email } = req.user;
  //     const serializableUser = {
  //       id: _id,
  //       first_name,
  //       last_name,
  //       age: Number(age),
  //       email,
  //       role: role || "user",
  //       cart: req.user.cart || [],
  //     };
  //     const token = generateToken(serializableUser, JWT_PRIVATE_KEY, {
  //       expiresIn: "1h",
  //     });

  //     res.cookie("authToken", token, {
  //       httpOnly: true,
  //       secure: true,
  //       sameSite: "Strict",
  //     });
  //     res.status(200).send({
  //       status: "success",
  //       message: "User logged in successfully",
  //       payload: {
  //         user: serializableUser,
  //       },
  //     });
  //     res.redirect("/products");
  //   } catch (error) {
  //     res.status(400).send({
  //       status: "error",
  //       error: "Invalid credentials",
  //       alert: "Invalid credentials, please try again",
  //     });
  //   }
  // }

  static async getLoginError(req, res) {
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
      role: role || "user",
      cart: req.user.cart || [],
    };
    const token = generateToken(serializableUser, JWT_PRIVATE_KEY, {
      expiresIn: "1h",
    });

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    res.status(200).send({
      status: "success",
      message: "User logged in successfully",
      redirectUrl: "/current",
    });
  }

  static async getCurrent(req, res) {
    const user = req.user;
    const userDTO = new UserDTO(user);
    res.send({payload: userDTO});
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
