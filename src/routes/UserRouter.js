const CustomRouter = require("./customRouter");

class UserRouter extends CustomRouter {
  initialize() {
    this.get("/custom-router", ["PUBLIC"], (req, res) => {
      res.sendUserError("Estamos mejorando nuestas funcionalidades");
    });

    this.post("/custom-router", ["PUBLIC"], (req, res) => {
      const { first_name, email } = req.user;
      if (!first_name || !email) {
        return res.sendUserError(
          "The fields first_name and email are required"
        );
      }
      res.sendSuccess("User created successfully");
    });
  }
}

module.exports = UserRouter;
