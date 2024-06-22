const { Router } = require("express");
const passport = require("passport");
const userModel = require("../dao/models/users");
const { generateToken, createdHash } = require("../utils");
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
const SessionController = require("../controllers/sessions.controller");

const sessionsRouter = Router();

sessionsRouter.post(
  "/register",
  passport.authenticate("register", {
    session: false,
    failureRedirect: "/api/sessions/registerFail",
  }),
  SessionController.registerUser
);

sessionsRouter.get("/registerFail", SessionController.getRegisterError);

sessionsRouter.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/loginFail",
    session: false,
  }),
  (req, res) => {
    const { _id, first_name, last_name, email, age } = req.user;
    let { role, cart } = req.user;

    const serializableUser = {
      id: _id,
      first_name,
      last_name,
      role,
      age,
      cart,
      email,
    };

    const token = generateToken(serializableUser, JWT_PRIVATE_KEY);
    res.cookie("rodsCookie", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.send({
      status: "success",
      message: "Logged in successfully",
    });
  }
);

sessionsRouter.get("/loginFail", (req, res) => {
  res.status(400).send({
    status: "error",
    error: "Login has failed",
  });
});

sessionsRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"], session: false }),
  async (req, res) => {}
);

sessionsRouter.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req, res) => {
    const { _id, first_name, last_name, email, age, role, cart } = req.user;

    const serializableUser = {
      _id: _id,
      first_name,
      last_name,
      email,
      age,
      role,
      cart,
    };
    const token = generateToken(serializableUser, JWT_PRIVATE_KEY);
    res.cookie("rodsCookie", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.redirect("/products");
  }
);

sessionsRouter.get(
  "/current",
  passport.authenticate("jwt", JWT_PRIVATE_KEY, { session: false }),
  (req, res) => {
    try {
      const user = req.user;
      res.status(200).json({ status: "success", payload: user });
    } catch (error) {
      res.status(500).json({
        status: "error",
        error: error.message,
      });
    }
  }
);

sessionsRouter.get("/logout", (req, res) => {
  res.clearCookie("rodsCookie");
  res.redirect("/login");

  res.send({ status: "success", message: "User logged out successfully" });
});

sessionsRouter.post("/resetPassword", async (req, res) => {
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
});

module.exports = sessionsRouter;
