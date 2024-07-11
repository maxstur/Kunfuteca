const MocksController = require("../controllers/mocks.controller");
const { Router } = require("express");
const mocksRouter = Router();

router.get("/users", MocksController.getUsers);

module.exports = mocksRouter;