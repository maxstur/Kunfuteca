const { Router } = require("express");
const passport = require("passport");
const userModel = require("../dao/models/users");
const jwt = require("jsonwebtoken");
const { getToken } = require("../utils");

const sessionsRouter = Router();

sessionsRouter.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "api/sessions/registerFail",
    session: false,
  }),
  async (req, res) => {
    res.send({
      status: "success",
      message: "Registered successfully",
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
    failureRedirect: "api/sessions/loginFail",
    session: false,
  }),
  async (req, res) => {
    const { _id, first_name, last_name, email, age, role } = req.user;
    const serializableUser = {
      _id: _id,
      first_name,
      last_name,
      email,
      age,
      role,
      cart,
    };

    const token = jwt.sign(serializableUser, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("rodsCookie", token, { httpOnly: true });
    res.send({
      status: "success",
      message: "Logged in successfully",
    });
  }
);

sessionsRouter.get("/loginFail", (req, res) => {
  res.status(400).send({
    status: "error",
    error: "Login fail",
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
    const token = jwt.sign(serializableUser, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("rodsCookie", token, { httpOnly: true });
    res.redirect("/products");
  }
);

sessionsRouter.get("/current", getToken, (req, res) => {
    const user = req.tokenUser;
    res.send({payload: user});
});


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
    details: result,
  });
});

module.exports = sessionsRouter;
