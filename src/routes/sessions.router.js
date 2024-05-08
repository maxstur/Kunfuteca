const { Router } = require("express");
const CartsManager = require("../dao/dbManagers/CartsManager");
const passport = require("passport");
const userModel = require("../dao/models/users");
const { createdHash, isValidPassword } = require("../utils");
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
sessionsRouter.get("/registerFail", (req, res) => {
  res.status(401).send({
    status: "error",
    error: "Authentication error",
  });
});

sessionsRouter.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/loginFail" }),
  async (req, res) => {
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
