const express = require("express");
const port = 8080;
const productsRouter = require("./routes/products.router");
const viewsRouter = require("./routes/views.router");
const cartsRouter = require("./routes/carts.router");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const ProductManager = require("./dao/dbManagers/ProductManager");
const mongoose = require("mongoose");
const messageModel = require("./dao/models/message");
const productManager = new ProductManager(__dirname + "/files/products.json");

mongoose
  .connect(
    `mongodb+srv://maarashu:1lP4iDn6WjdPOiNS@kunfuteca.xja1mzn.mongodb.net/ecommerce`
  )
  .then(() => console.log("Conectado a MongoDB - Atlas"))
  .catch((err) => console.log(err));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    io.emit("Lista actualizada", { products });
  });

  socket.on("delete product", async ({ id }) => {
    await productManager.deleteProduct(id);
    const products = await productManager.getProducts();
    io.emit("Lista actualizada", { products });
  });

  /* Chat */
  const messages = await messageModel.find().lean();
  socket.emit("chat messages", { messages });

  socket.on("new message", async ({ messageInfo }) => {
    await messageModel.create(messageInfo);
    const messages = await messageModel.find().lean();
    io.emit("chat messages", { messages });
  });
});

// Otras configuraciones y rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
