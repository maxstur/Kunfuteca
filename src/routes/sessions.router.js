const { Router } = require("express");
const passport = require("passport");
const userModel = require("../dao/models/users");
const {
  callPassport,
  checkRoleAuthorization,
  generateToken,
} = require("../utils");
const { JWT_SECRET } = require("../config/jwt.config");
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
  res.status(400).send({
    status: "error",
    error: "There was an error registering the user",
  });
});

/** LOGIN */

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
    const token = jwt.sign(serializableUser, JWT_SECRET, {
      expiresIn: "2h",
    });

    // Configurar la cookie con la opción HttpOnly
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
    const token = jwt.sign(serializableUser, JWT_SECRET, {
      expiresIn: "2h",
    });
    res.cookie("rodsCookie", token);
    res.redirect("/current");
  }
);

sessionsRouter.get("/logout", (req, res) => {
  res.clearCookie("rodsCookie");
  res.redirect("/login");
});

sessionsRouter.post("/resetPassword", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .send({ status: "error", error: "Email and password are required" });
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).send({ status: "error", error: "User not found" });
  }

  /** hasheamos la nueva contraseña */
  const hashedPassword = createHash(password);

  const result = await userModel.updateOne(
    { _id: user._id },
    { $set: { password: hashedPassword } }
  );

  if (!result) {
    return res
      .status(400)
      .send({ status: "error", error: "Password not updated" });
  }

  res.send({
    status: "success",
    message: "Password changed successfully",
    details: result,
  });
});

sessionsRouter.get(
  "/current",
  passport.authenticate("current", { session: false }), // Autenticar al usuario utilizando la estrategia "current"
  (req, res) => {
    // Una vez que el usuario está autenticado, puedes acceder a él desde req.user
    const user = req.user; // Obtener el usuario autenticado desde req.user

    // Generar el token para el usuario autenticado
    const token = jwt.sign(user.toJSON(), JWT_SECRET, {
      expiresIn: "2hs", // Establecer la expiración del token
    });

    // Configurar la cookie con el token generado
    res.cookie("rodsCookie", token, { httpOnly: true });

    // Enviar la respuesta con el usuario autenticado y el token generado
    res.send({ payload: user, token });
  }
);
module.exports = sessionsRouter;
