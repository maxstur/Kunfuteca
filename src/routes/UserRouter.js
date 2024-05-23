const CustomRouter = require("./customRouter");

class UserRouter extends CustomRouter { 
    initialize() {

        this.get("/custom-router", (req, res) => {
            res.send("Estamos mejorando nuestas funcionalidades")
        })

    }
}

module.exports = UserRouter;