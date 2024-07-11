const { Router } = require("express");
const passport = require("passport");
const SessionController = require("../controllers/sessions.controller");
const getToken = require("../middlewares.js/getToken.middleware");

const sessionsRouter = Router();

sessionsRouter.post("/register", SessionController.registerUser);
sessionsRouter.post("/login", SessionController.login);
sessionsRouter.get("/login-fail", SessionController.getLoginError);
sessionsRouter.get("/logout", SessionController.logout);
sessionsRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
sessionsRouter.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "/login-fail",
    session: false,
  }),
  SessionController.github
);

sessionsRouter.get("/", getToken, SessionController.getProfile);
sessionsRouter.post("/reset-password", SessionController.getResetPassword);

module.exports = sessionsRouter;
