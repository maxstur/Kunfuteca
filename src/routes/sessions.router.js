const { Router } = require("express");
const passport = require("passport");
const userModel = require("../dao/models/users");
const {
  callPassport,
  checkRoleAuthorization,
  generateToken,
} = require("../utils");
const { JWT_SECRET } = require("../config/passport.config");
const jwt = require("jsonwebtoken");

const sessionsRouter = Router();

sessionsRouter.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "api/sessions.registerFail",
    session: false,
  }),
  (req, res) => {
    res.send({
      status: "success",
      message: "Registered successfully",
    });
  }
);

sessionsRouter.get("/registerFail", (req, res) => {
  res.status(401).send({
    status: "error",
    error: "Authentication error",
  });
});

sessionsRouter.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "api/sessions/loginFail",
    session: false,
  }),
  (req, res) => {
    const { _id, first_name, last_name, role, email, cart, age } = req.user;

    const serializableUser = {
      id: _id,
      first_name,
      last_name,
      role,
      email,
      cart,
      age,
    };
    const token = jwt.sign(serializableUser, "JWT_SECRET", {
      expiresIn: "2hs",
    });
    res.cookie("rodsCookie", token);
  }
);

sessionsRouter.get("/loginFail", (req, res) => {
  res.status(401).send({
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
    const { _id, first_name, last_name, role, email, cart, age } = req.user;
    const serializableUser = {
      id: _id,
      first_name,
      last_name,
      role,
      email,
      cart,
      age,
    };
    const token = jwt.sign(serializableUser, "JWT_SECRET", {
      expiresIn: "2hs",
    });
    res.cookie("rodsCookie", token);
    res.redirect("/products");
  }
);

sessionsRouter.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Your session is being destroyed");
  });
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
    return res.status(401).send({ status: "error", error: "User not found" });
  }

  /** hasheamos la nueva contraseña */
  const hashedPassword = createHash(password);

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

sessionsRouter.post("/login", (req, res) => {
  const { email, password } = req.body;

  let user = user.find((u = u.email == email && u.password == password));
  if (!user) {
    return res
      .status(400)
      .send({ status: "error", error: "incorrect credentials" });
  }

  const token = jet.sign({ email, password, role: user.role }, JWT_SECRET, {
    expiresIn: "5hs",
  });
  res
    .cookie("rodsCookie", token, { httpOnly: true })
    .send({ status: "success", message: "succsessfully logged in" });
});

sessionsRouter.get(
  "/current",
  callPassport("jwt"),
  checkRoleAuthorization("admin"),
  (req, res) => {
    res.send({
      status: "success",
      user: req.user,
      token: req.cookies.rodsCookie,
    });
  }
);

module.exports = sessionsRouter;
