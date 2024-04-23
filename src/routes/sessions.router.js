const { Router } = require("express");
const userModel = require("../dao/models/users");
const { createHash, isValidPassword } = require("../utils");

const sessionsRouter = Router();

sessionsRouter.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password, confirm_password } =
    req.body;

  if (!first_name || !last_name || !email || !age || !password) {
    return res.status(400).send({ status: "error", error: "Missing data" });
  }

  // Validar que la contraseña coincida con la confirmación de la contraseña
  if (password !== confirm_password) {
    return res
      .status(400)
      .send({ status: "error", error: "Passwords do not match" });
  }

  try {
    let role = "user";

    if (email == "adminCoder@coder.com" && password == "adminCod3r123") {
      role = "admin";
    }
    const hashedPassword = createHash(password);
    const result = await userModel.create({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
      role,
    });

    res.send({
      status: "success",
      message: role == "admin" ? "Admin created" : "User created",
      details: result,
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
    return res.status(400).send({
      status: "error",
      error: "You sould provide right email and password",
    });
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(401).send({ status: "error", error: "User not found" });
  }

  // Validar que la contraseña coincida
  if (!isValidPassword(user, password)) {
    return res.status(401).send({ status: "error", error: "Invalid password" });
  }

  // Construir el objeto de sesión
  req.session.user = {
    name: `${user.first_name} ${user.last_name}`,
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
});

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

module.exports = sessionsRouter;
