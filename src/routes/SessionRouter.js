const CustomRouter = require("./CustomRouter");
const jwt = require("jsonwebtoken");

const users = [
  { email: "adminCoder@coder.com", role: "admin" },
  { email: "robert@takena.com", role: "user" },
];

class SessionRouter extends CustomRouter {
  initilize() {
    this.post("/userpolicies", ["PUBLIC"], (req, res) => {
      // let user = {
      //     email: req.email,
      //     role: 'user'
      // }
      let user = users.find((u = u.email == req.body.email));

      const token = jwt.sign(user, "secret");
      res.sendSuccess({ token });
    });
  }
}

module.exports = SessionRouter; 
