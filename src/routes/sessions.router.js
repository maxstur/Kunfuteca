const { Router } = require("express");
const passport = require("passport");
const userModel = require("../dao/models/users");
const { callPassport, checkRoleAuthorization } = require("../utils");
const { JWT_SECRET } = require("../config/passport.config");
const jwt = require("jsonwebtoken");

const sessionsRouter = Router();

sessionsRouter.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "registerFail",
  }),
  async (req, res) => {
    res.send({
      status: "success",
      message: "Registered successfully",
    });
  }
);

sessionsRouter.get("api/sessions/registerFail", (req, res) => {
  res.status(401).send({
    status: "error",
    error: "Authentication error",
  });
});

sessionsRouter.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "api/sessions/loginFail" }),
  (req, res) => {
    const user = req.user;

    req.session.user = {
      name: ` ${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      role: user.role,
    };

    // Enviar la respuesta con el mensaje y los datos de sesión
    res.send({
      status: "success",
      payload: req.session.user,
      message: "Logged in successfully",
    });
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
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

sessionsRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = {
      name: req.user.first_name,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
    };
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
