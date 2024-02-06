const express = require("express");
const port = 8080;
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(
    `Servidor Kunfuteando en: http://localhost:${port}`
  );
});

// Otras configuraciones y rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);