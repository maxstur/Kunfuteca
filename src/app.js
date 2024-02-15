const express = require("express");
const port = 8080;
const productsRouter = require("./routes/products.router");
const viewsRouter = require("./routes/views.router");
const cartsRouter = require("./routes/carts.router");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const ProductManager = require("./ProductManager");
const productManager = new ProductManager(__dirname + "/files/products.json");

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

io.on("connection", (socket) => {
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
});

// Otras configuraciones y rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
