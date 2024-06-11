const { Router } = require("express");
const CartsManager = require("../dao/dbManagers/CartsManager");
const ProductManager = require("../dao/dbManagers/ProductManager");
const jwt = require("jsonwebtoken");
const { getToken } = require("../utils");
const ViewsController = require("../controllers/views.controller");

const cartsManager = new CartsManager();
const productManager = new ProductManager();

const viewsRouter = Router(); 
/** views */
viewsRouter.get("/", ViewsController.getProductsHome);
viewsRouter.get("/realtimeproducts", ViewsController.getRealTimeProducts);
viewsRouter.get("/chat", ViewsController.getChat);

/** products with token */
viewsRouter.get("/products", ViewsController.getProducts);

/** alternative */
viewsRouter.get("/products.alt", ViewsController.getProductsAlternative);

viewsRouter.get("/products/:pid", ViewsController.getProduct);
/** ----------------- */

viewsRouter.get("/carts/:cid", ViewsController.getCart);

viewsRouter.get("/carts/:cid/products", ViewsController.getCartProducts);

/** Register ["PUBLIC"],*/
viewsRouter.get("/register", ViewsController.getRegister);
/** Login ["PUBLIC"],*/ 
viewsRouter.get("/login",  ViewsController.getLogin);

// viewsRouter.get("/current", populate("cart").lean(), (req, res) => {
//   // ó "/current", authToken, (req, res)
//   res.render("current", { carts, user: req.tokenUser });
//   //or res.render('profile',{user: {}})
// });

// Or
// Comparada con esta de arriba, ESTA DE ABAJO ES MAS LIMPIA
// viewsRouter.get("/current", authToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.tokenUser._id).populate('cart').lean();

//     if (!user) {
//       return res.status(404).send({ status: "error", error: "User not found" });
//     }

//     res.render("current", { user });
//   } catch (error) {
//     res.status(500).send({ status: "error", error: "Server error" });
//   }
// });

//Luego hacer un getBy(params)
// async getBy(params){
//   let result = await userModel.find(params).populate('cart').lean(); //<- this.model.find(params).lean();
//}

/**["PUBLIC"], */
viewsRouter.get("/resetPassword",  ViewsController.getResetPassword);
viewsRouter.get("/logout", ViewsController.getLogout);

//Cálculo bloqueante y cantidad de vistas (Fin de la clase 25)

viewsRouter.get("/calcNoBlocking", ViewsController.getCalcNoBlocking);

viewsRouter.get("/soldProducts", ViewsController.getSoldProducts);
  

module.exports = viewsRouter;
