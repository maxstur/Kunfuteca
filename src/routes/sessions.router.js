const { Router } = require("express");
const passport = require("passport");
const { getToken } = require("../utils");
const SessionController = require("../controllers/sessions.controller");

const sessionsRouter = Router();

//class SessionsRouter extends CustomRouter {

sessionsRouter.post(
  "/register",
  passport.authenticate("register", {
    session: false,
    failureRedirect: "/api/sessions/registerFail",
  }),
  SessionController.registerUser
);

sessionsRouter.get("/registerFail", SessionController.getRegisterError);

sessionsRouter.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/loginFail",
    session: false,
  }),
  SessionController.login
);

sessionsRouter.get("/loginFail", SessionController.getLoginError);
sessionsRouter.get("/logout", SessionController.logout);

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
  SessionController.github
);

sessionsRouter.get("/current", getToken, SessionController.getCurrent);
sessionsRouter.post("/resetPassword", SessionController.getResetPassword);

module.exports = sessionsRouter;
