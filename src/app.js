require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const port = 8080;
const productsRouter = require("./routes/products.router");
const viewsRouter = require("./routes/views.router");
const cartsRouter = require("./routes/carts.router");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const ProductManager = require("./dao/dbManagers/ProductManager");
const messageModel = require("./dao/models/message");
const productManager = new ProductManager(__dirname + "/files/products.json");
const connectDB = require("./dbConnect/db");
const session = require("express-session");
const FileStore = require("session-file-store");
const MongoStore = require("connect-mongo");

// Llama a la función connectDB para conectar con MongoDB
connectDB();

const app = express();

/** Middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const fileStore = FileStore(session);
app.use(cookieParser("coderSecret"));
app.use(
  session({
    secret: "zFckEEhSecret",
    resave: false,
    saveUninitialized: false,
    store: new fileStore({
      path: `${__dirname}/fileSession`,
      ttl: 100,
      retries: 0,
    }),
  })
);

// Configuración del motor de plantillas, Handlebars

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

// public
app.use(express.static(`${__dirname}/public`));

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

/** Sessions */

app.get("/session", (req, res) => {
  if (req.session.conuter) {
    req.session.conuter++;
    res.send(`Views: ${req.session.conuter}`);
  } else {
    req.session.conuter = 1;
    res.send("Welcome! Your session has been created");
  }
});

const users = [
  { username: "Elba", password: "gallo", isAdmin: true },
  { username: "NotAdmin", password: "gallo", isAdmin: false },
];

app.get("/login", (req, res) => {
  const { username, password } = req.query;

  const user = users.find(
    (u) => u.username == username && u.password == password
  );
  if (!user) {
    return res.status(400).send("Wrong credentials");
  }

  req.session.username = username;
  req.session.admin = user.isAdmin;
  req.session.visitCounter = 1;

  res.send({ status: "Logged in", isAdmin: req.session.admin });
});

app.get("/deleteSession", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send({ status: "error", message: err });
    } else {
      res.send("Session deleted");
    }
  });
});

function autenticate(req, res, next) {
  if (req.session.username) {
    next();
  }
  res.status(400).send("Wrong credentials, not authenticated ");
}

app.get("/private", autenticate, (req, res) => {
  const name = req.session.name || "";

  req.session.visitCounter++;
  res.send(` 
    <h1>Welcome ${name} </h1>
    <h3>You can see this cause of you'r looged in. </h3>
    <p>Visits ${req.session.visitCounter} times</p>
    `);
});

// Otras configuraciones y rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);


