const express = require("express");
const { Router } = require("express");
const userModel = require("../dao/models/users");

const sessionsRouter = Router();

sessionsRouter.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password, confirm_password } =
    req.body;

  if (
    !first_name ||
    !last_name ||
    !email ||
    !age ||
    !password ||
    !confirm_password
  ) {
    return res
      .status(400)
      .send({ status: "error", error: "All fields are required" });
  }
  if (password !== confirm_password) {
    return res
      .status(400)
      .send({ status: "error", error: "Passwords do not match" });
  }

  try {
    const result = await userModel.create({
      first_name,
      last_name,
      email,
      age,
      password,
      confirm_password,
      role: "user",
    });
    // Verificar si el usuario es admin
    const isAdmin =
      result.email == "adminCoder@coder.com" &&
      result.password == "adminCod3r123";

    if (isAdmin) {
      result.role = "admin";
      await result.save();
    }

    res.send({
      status: "success",
      message: isAdmin ? "Admin created" : "User created",
    });
  } catch (error) {
    res.send({
      status: "error",
      error: error.message,
      message: "User not created",
    });
  }
});

sessionsRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .send({ status: "error", error: "You sould provide email and password" });
  }

  const user = await userModel.findOne({ email, password });
  if (!user) {
    return res.status(401).send({ status: "error", error: "User not found" });
  }

  // Construir el objeto de sesión
  req.session.user = {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    age: user.age,
    role: user.role,
  };

  // Enviar mensaje diferente dependiendo del rol del usuario
  const message = user.role === "admin" ? "Admin logged in" : "User logged in";

  // Enviar la respuesta con el mensaje y los datos de sesión
  res.send({
    status: "success",
    payload: req.session.user,
    message: message,
  });
});

sessionsRouter.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Your session is being destroyed");
  });
  res.redirect("/login");
});

module.exports = sessionsRouter;
