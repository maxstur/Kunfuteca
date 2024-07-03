const { Command } = require("commander");
const dotenv = require("dotenv");

/** Conf Commander & Dotenv*/
const program = new Command();
program.option("--mode <modo>").parse(process.argv);
const options = program.opts();
console.log(options);
dotenv.config({
  path: `.env.${options.mode}`,
});

const express = require("express");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const passport = require("passport");
const initializePassport = require("./config/passport.config");
const cookieParser = require("cookie-parser");

/** Configs */
const PORT = require("./config/environment.config").PORT;
const ENVIRONMENT = require("./config/environment.config").ENVIRONMENT;
const MONGO_CONNECTOR_LINK =
  require("./config/environment.config").MONGO_CONNECTOR_LINK;

/** Routes */
const productsRouter = require("./routes/products.router");
const viewsRouter = require("./routes/views.router");
const cartsRouter = require("./routes/carts.router");
const sessionsRouter = require("./routes/sessions.router");

/** Managers */
const ProductManager = require("./dao/dbManagers/ProductManager");
const messageModel = require("./dao/models/message");
const productManager = new ProductManager(__dirname + "/files/products.json");

/** App */
const app = express();

/** Cookie Parser & Middlewares*/
app.use(cookieParser());
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** Passport */
initializePassport();

/** Handlebars */
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

mongoose
  .connect(MONGO_CONNECTOR_LINK)
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Passport
app.use(passport.initialize());

// Server Config
const serverHttp = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}, in environment ${ENVIRONMENT}`);
});

// sockets.io
const io = new Server(serverHttp);

app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on("connection", async (socket) => {
  console.log("Socket conectado");

  socket.on("createNewProduct", async (newProduct) => {
    await productManager.addProduct(newProduct);
    const products = await productManager.getProducts();
    io.emit("Lista actualizada", { products: products });
  });

  socket.on("deleteProduct", async ({ id }) => {
    await productManager.deleteProduct(id);
    const products = await productManager.getProducts();
    io.emit("Lista actualizada", { products: products });
  });

  /* Chat */

  const messages = await messageModel.find().lean();
  socket.emit("chat messages", { messages });

  socket.on("new message", async (messageInfo) => {
    await messageModel.create(messageInfo);
    const messages = await messageModel.find().lean();
    io.emit("chat messages", { messages });
  });
});

// Rutas API - app.use
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);

app.use("/", viewsRouter);
