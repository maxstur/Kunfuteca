const { Router } = require("express");
const userModel = require("../dao/models/users");

const sessionsRouter = Router();

sessionsRouter.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  if (!first_name || !last_name || !email || !age || !password) {
    return res
      .status(400)
      .send({ status: "error", error: "All fields are required" });
  }
  const result = await userModel.create({
    first_name,
    last_name,
    email,
    age,
    password,
  });
  res.send({ status: "success", message: "User created" });
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
  req.session.user = {
    name: `${user.first_name},${user.last_name}`,
    email: user.email,
    age: user.age,
  };

  res.send({
    status: "success",
    payload: req.session.user,
    message: "User logged in",
  });
});

module.exports = sessionsRouter;
