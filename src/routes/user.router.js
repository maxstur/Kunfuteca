const CustomRouter = require("./custom.router");
const { checkRoleAuthorization } = require("../utils");

const customRouter  = new CustomRouter();

class UserRouter extends CustomRouter {
  initialize() {
    //Ejemplo de clase 23. 1º39'32"
    // this.get("/idem-class23", (req, res, next) => {
    //   console.log("Here, User Router exttend Custom Router"); next()}, (req,res)=>{
    //   res.send("You have reached a custom UserRouter")
    // });

    // this.get(
    //   "/current",
    //   this.handlePolicies(["USER", "ADMIN"]),
    //   (req, res) => {
    //     res.send({
    //       status: "success",
    //       message: "You have reached the current user router",
    //       user: req.user,
    //     });
    //   }
    // );

    // this.get("/custom-router", ["PUBLIC"], (req, res, next) => {
    //   res.sendUserError("You have reached Premium Content, register to see it");
    // });

    this.post("/premium-router", ["PREMIUM", "ADMIN"], (req, res) => {
      const { first_name, email } = req.user;
      if (!first_name || !email) {
        return res.sendUserError(
          `The fields "first_name" and "email" are required`)}

      res.sendSuccess("Account validated successfully");
    });
    this.get("/only-admins", ["USER"], (req, res) => {
      if (req.user.role !== "ADMIN") {
        return res.sendUserError("Only admins can access this route");
      }
      res.sendSuccess("Dear Admin, you have reached UserRouter");
    });
    this.get("/simulate-server-error", ["PUBLIC"], (req, res) => {
      // Simulamos un error del servidor
      res.sendServerError("Sorry something went wrong, try again later");
    });
    this.get("/custom-accounts", ["ADMIN"], (req, res) => {
      res.sendSuccess("Dear Admin, you have reached UserRouter");
    });
    this.get("/premium-members", ["PREMIUM", "ADMIN"], (req, res) => {
    //   const { first_name, email, membership } = req.user;

    //   if (!first_name || !email || !membership) {
    //     return res.sendUserError(
    //       `The fields "first_name", "email" and "membership" are required`
    //     );
    //   }
      res.sendSuccess("Welcome, premium member!");
    });
  }
}

module.exports = UserRouter;
