const { Router } = require("express");
const passport = require("passport");
const SessionController = require("../controllers/sessions.controller");
const { getToken, setTokenCookie, jwtMiddleware } = require("../utils");

const sessionsRouter = Router();

sessionsRouter.post(
  "/register",
  passport.authenticate("register", { session: false }),
  setTokenCookie,
  SessionController.registerUser
);

sessionsRouter.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/login-fail" }),
  SessionController.login
);

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

sessionsRouter.get("/current", jwtMiddleware, SessionController.getCurrent);

sessionsRouter.post("/reset-password", SessionController.getResetPassword);

module.exports = sessionsRouter;
