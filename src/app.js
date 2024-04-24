const express = require("express");
const session = require("express-session");
const productsRouter = require("./routes/products.router");
const { viewsRouter } = require("./routes/views.router");
const cartsRouter = require("./routes/carts.router");
const sessionsRouter = require("./routes/sessions.router");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const ProductManager = require("./dao/dbManagers/ProductManager");
const messageModel = require("./dao/models/message");
const productManager = new ProductManager(__dirname + "/files/products.json");
const MongoStore = require("connect-mongo");
const port = 8080;
require("dotenv").config();
const passport = require("passport");
const initializePassport = require("./config/passport.config");

const app = express();

/** Handlebars */
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

/** DB Conection */
mongoose
  .connect(
    `mongodb+srv://maarashu:${process.env.MONGODB_PASS}@kunfuteca.xja1mzn.mongodb.net/login`,
  )
  .then(() => console.log("DB connected"));

// Session
app.use(
  session({
    secret: "zFckEEhSecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://maarashu:${process.env.MONGODB_PASS}@kunfuteca.xja1mzn.mongodb.net/login`,
      ttl: 3600,
    }),
    cookie: {
      maxAge: 1000 * 60 * 1080, // Tiempo de vida de la cookie en milisegundos (en este caso, 1 día)
      secure: false,
      httpOnly: true,
      sameSite: 'strict'
    },
  })
);

/** Middlewares */
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** Passport */
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

/**Port Config */
const serverHttp = app.listen(port, () => {
  console.log(`Servidor Kunfuteando en: http://localhost:${port}`);
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

// Rutas API
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);

// Rutas de vista
app.use("/", viewsRouter);
