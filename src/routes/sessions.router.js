const { Router } = require("express");
const passport = require("passport");
const userModel = require("../dao/models/users");
const jwt = require("jsonwebtoken");
const {
  generateToken,
  authToken,
  createdHash,
  isValidPassword,
  checkRoleAuthorization,
  getToken,
} = require("../utils");
const { JWT_PRIVATE_KEY } = require("../config/environment.config");

const sessionsRouter = Router();

sessionsRouter.post(
  "/register",
  passport.authenticate("register", {
    session: false,
    failureRedirect: "/api/sessions/registerFail",
    passReqToCallback: true,
  }),
  (req, res) => {
    res.send({
      status: "success",
      message: "User registered successfully",
    });
  }
);

sessionsRouter.get("/registerFail", (req, res) => {
  res.status(400).send({
    status: "error",
    error: "There was an error registering the user",
  });
});

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
  (req, res, next) => {
    const token = getToken(req);
    if (!token) {
      return res.status(403).send({ status: "error", error: "Not authorized" });
    }
    const user = verifyToken(token);
    if (!user) {
      return res.status(403).send({ status: "error", error: "Not authorized" });
    }
    req.user = user;
    next();
  },
  (req, res) => {
    res.send({
      status: "success",
      user: req.user,
      message: "User retrieved successfully",
    });
  }
);

sessionsRouter.get("/logout", (req, res) => {
  res.clearCookie("rodsCookie");
  res.redirect("/login");
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
