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
    const user = await userModel.create({
      first_name,
      last_name,
      email,
      age,
      password,
    });
    res.send({ status: "success", message: "User created" });
  } catch (error) {
    res.send({
      status: "error",
      error: error.message,
      message: "User already exists",
    });
  }
});

sessionsRouter.post("/login", async (req, res) => {
  
  const { email, password } = req.body;
º
  if (!email || !password) {
    return res
      .status(400)
      .send({ status: "error", error: "You sould provide email and password" });
  }

  const user = await userModel.findOne({ email, password });
  if (!user) {
    return res.status(401).send({ status: "error", error: "User not found" });
  }

  if (user.email == 'adminCoder@coder.com' && user.password == 'adminCod3r123') {
    user.role = "admin";
  }

  req.session.user = {
    name: `${user.first_name},${user.last_name}`,
    email: user.email,
    age: user.age,
    role: user.role,
  };

  res.send({
    status: "success",
    payload: req.session.user,
    message: "User logged in",
  });
});

sessionsRouter.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send('Your session is being destroyed');
  })
  res.redirect('/login')
})

module.exports = sessionsRouter;
