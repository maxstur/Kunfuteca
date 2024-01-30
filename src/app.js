const express = require("express");
const app = express();
const port = 8080;

const productsRouter = require("./routes/products");
const cartsRouter = require("./routes/carts");

app.use(express.json());

// Otras configuraciones y rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.listen(port, () => {
  console.log(
    `Servidor Kunfuteando en el puerto ${port}: http://localhost:${port}`
  );
});
