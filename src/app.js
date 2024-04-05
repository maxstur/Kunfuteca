require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const port = 8080;
const productsRouter = require("./routes/products.router");
const viewsRouter = require("./routes/views.router");
const cartsRouter = require("./routes/carts.router");
const sessionsRouter = require("./routes/sessions.router");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const ProductManager = require("./dao/dbManagers/ProductManager");
const messageModel = require("./dao/models/message");
const productManager = new ProductManager(__dirname + "/files/products.json");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();

/** DB Conection */
mongoose
  .connect(
    `mongodb+srv://maarashu:1lP4iDn6WjdPOiNS@kunfuteca.xja1mzn.mongodb.net/`
  )
  .then(() => console.log("DB connected"));

/** Middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// public
app.use(express.static(`${__dirname}/public`));

app.use(cookieParser("coderSecret"));
app.use(
  session({
    secret: "zFckEEhSecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://maarashu:1lP4iDn6WjdPOiNS@kunfuteca.xja1mzn.mongodb.net/`,
      ttl: 3600,
    }),
  })
);

// Configuración del motor de plantillas, Handlebars

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

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

/** Cookies */

app.get("/viewCookiesHandlebars", (req, res) => {
  res.render("cookies");
});

app.post("/cookies", (req, res) => {
  const data = req.body;
  res.cookie("coderCookie", data, { maxAge: 120 * 1000, signed: true });
  res.send({ status: "success", message: "Cookies enviadas" });
});

app.get("/cookies", (req, res) => {
  const cookies = req.signedCookies.cookies;
  res.send({ status: "success", payload: cookies });
});

app.get("/clearCookie", (req, res) => {
  /** Es el /* del ej del profesor. Para que se limpie la cookie */
  res.clearCookie("coderCookie");
  res.send("Cookie eliminada");
});

// Otras configuraciones y rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/sessions", sessionsRouter);
