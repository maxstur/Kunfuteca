const ProductManager = require("../dao/dbManagers/ProductManager");
const productManager = new ProductManager(__dirname + "/../files/products.json");

class ViewsController {
    static async getProductsHome(req, res) {
        try {
            const products = await productManager.getProducts();
            res.render("realTimeProducts", { products });
        } catch (error) {
            res.status(500).send({ error: "Error al obtener los productos" });
        }
    }

    static async getRealTimeProducts(req, res) {
        try {
            const products = await productManager.getProducts();
            res.render("realTimeProducts", { products });
        } catch (error) {
            res.status(500).send({ error: "Error al obtener los productos" });
        }
    }

    static async getChat(req, res) {
        res.render("chat", {});
    }

    //<---privateAccess--->
    //<---privateAccess--->
    //<---privateAccess--->
    // | | | | | | | | | |
    // V V V V V V V V V V 
    static async getProducts(req, res) {
        try {
            const { users, docs, ...rest } = await productManager.getProducts(req.query);
            res.render("products", { users, products: docs, ...rest });
          } catch (error) {
            res.send({ status: "error", error: error.message });
          }
    } 

}    

module.exports = ViewsController