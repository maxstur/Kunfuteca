const { Router } = require("express");
const passport = require("passport");
const SessionController = require("../controllers/sessions.controller");
const { getToken } = require("../utils");

const sessionRouter = Router();

sessionRouter.post(
  "/register",
  passport.authenticate("register"),
  SessionController.registerUser
);
sessionRouter.post(
  "/login",
  passport.authenticate("login"),
  SessionController.login
);
sessionRouter.get("/login-fail", SessionController.getLoginError);
sessionRouter.get("/logout", SessionController.logout);

sessionRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"], session: false }),
  SessionController.github
);
sessionRouter.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  }),
  SessionController.github  
);

sessionRouter.get("/current", SessionController.getCurrent);
sessionRouter.post("/reset-password", SessionController.getResetPassword);

module.exports = sessionRouter;

