const express = require("express");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
// const session = require("express-session");
const passport = require("passport");
const initializePassport = require("./config/passport.config");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const { Command } = require("commander");

/** Configs */
const {
  PORT,
  ENVIRONMENT,
  JWT_PRIVATE_KEY,
  MONGO_CONNECTOR_LINK,
  SESSION_SECRET,
} = require("./config/environment.config");

/** Routes */
const productsRouter = require("./routes/products.router");
const viewsRouter = require("./routes/views.router");
const cartsRouter = require("./routes/carts.router");
const sessionsRouter = require("./routes/sessions.router");
//const CustomRouter = require("./routes/custom.router");
const userRouter = require("./routes/user.router");

const ProductManager = require("./dao/dbManagers/ProductManager");
const messageModel = require("./dao/models/message");
const productManager = new ProductManager(__dirname + "/files/products.json");

/** Conf Commander & Dotenv*/
const program = new Command();
program.option("--mode <modo>").parse();

const options = program.opts();
console.log(options);

dotenv.config({
  path: `.env.${options.mode}`,
});

/** App */
const app = express();

/** Cookie Parser */
app.use(cookieParser());

/** Handlebars */
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

mongoose
  .connect(MONGO_CONNECTOR_LINK)
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.error("Could not connect to MongoDB", err));


/** Middlewares */
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(session({
//   secret: SESSION_SECRET, 
//   resave: false,
//   saveUninitialized: false
// }));

/** Passport */
initializePassport();
app.use(passport.initialize());
app.use(passport.session());


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
const UserRouter = new userRouter();
app.use("/api/users", UserRouter.getRouter());
app.use("/", viewsRouter);
