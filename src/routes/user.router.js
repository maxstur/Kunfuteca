const CustomRouter = require("./custom.router");

class UserRouter extends CustomRouter {
  initialize() {
    //Ejemplo de clase 23. 1º39'32"
    // this.get("/idem-class23", (req, res, next) => {
    //   console.log("Here, User Router exttend Custom Router"); next()}, (req,res)=>{
    //   res.send("You have reached a custom UserRouter")
    // });

    this.get("/custom-router", ["PUBLIC"], (req, res, next) => {
      res.sendUserError("You have reached Premium Content, register to see it");
    });

    this.post("/custom-router", ["USER", "ADMIN"], (req, res) => {
      const { first_name, email } = req.user;
      if (!first_name || !email) {
        return res.sendUserError(
          "The fields first_name and email are required"
        );
      }
      res.sendSuccess("Account validated successfully");
    });

    this.get("/custom-admins", ["USER"], (req, res) => {
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

    this.get("/premium-route", ["PREMIUM", "ADMIN"], (req, res) => {
      res.sendSuccess("Welcome, premium user!");
    });
      
  }
}

module.exports = UserRouter;