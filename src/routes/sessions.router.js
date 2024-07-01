const { Router } = require("express");
const passport = require("passport");
const SessionController = require("../controllers/sessions.controller");
const { getToken } = require("../utils");

const sessionsRouter = Router();

sessionsRouter.post(
  "/register",
  passport.authenticate("register"),
  SessionController.registerUser
);
sessionsRouter.post(
  "/login",
  passport.authenticate("login"),
  SessionController.login
);
sessionsRouter.get("/login-fail", SessionController.getLoginError);
sessionsRouter.get("/logout", SessionController.logout);

sessionsRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"], session: false }),
  SessionController.github
);
sessionsRouter.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  }),
  SessionController.github  
);

sessionsRouter.get("/current", SessionController.getCurrent);
sessionsRouter.post("/reset-password", SessionController.getResetPassword);

module.exports = sessionsRouter;

