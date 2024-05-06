// const { CustomRouter } = require('./CustomRouter'); // <---Esto es otra respuesta--->

// class UserRouter extends CustomRouter {
//     initialize() {
//         this.post('/register', ['PUBLIC'], async (req, res) => {
//             const { first_name, last_name } = req.body;
//             if (!first_name || !last_name) return res.sendUserError('Invalid parameters');

//             try {
//                 // Aquí iría la lógica para registrar un nuevo usuario en la base de datos
//                 res.sendSuccess('User created successfully');
//             } catch (error) {
//                 res.sendServerError(error.message);
//             }
//         });

//         this.get('/profile', ['USER', 'ADMIN'], async (req, res) => {
//             // Aquí iría la lógica para obtener el perfil del usuario
//             res.sendSuccess(req.user);
//         });
//     }
// }

// module.exports = UserRouter;

// const {CustomRouter} = require('./CustomRouter');  // <---Esto lo dio el profesor--->

// class UserRouter extends CustomRouter {
//     initialize(){

//         this.get('/userpolicies', ["PUBLIC"], (req,res)=>{
//             res.sendSuccess(`Hi you've reached Custom & User Router`)
//         })

//         this.post('/userpolicies', ["PUBLIC"], (req, res)=>{
//             const {first_name, last_name} = req.body;
//             if(!first_name || !last_name) return res.sendUserError('invalid parameters')

//             res.sendSuccess('User created successfully')
//         })

//         this.get('/publicroute', ["PUBLIC"], (req,res)=>{
//             res.sendSuccess(`Hi you'r in`)
//         })

//         this.get('/privateaccess', ["USER", "ADMIN"], (req,res)=>{
//             res.sendSuccess(`You have access for this`)
//         })

//         this.get('/adminonly', ["ADMIN"], (req,res)=>{
//             res.sendSuccess(`Access only for admin`)
//         })
//     }
// }

// module.exports = UserRouter;

// const { CustomRouter } = require("./CustomRouter");
// const jwt = require("jsonwebtoken");
// const userModel = require("../dao/models/users");
// const { JWT_SECRET } = require("../config/jwt.config");

// class SessionRouter extends CustomRouter {
//   initialize() {
//     this.post("/login", ["PUBLIC"], async (req, res) => {
//       const { email, password } = req.body;

//       try {
//         // Aquí iría la lógica para autenticar al usuario y generar el token JWT
//         const user = await userModel.findOne({ email }); // Aquí se buscaría el usuario en la base de datos
//         if (!user || !isValidPassword(user, password)) {
//           return res.sendUserError("Invalid email or password");
//         }

//         const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET);
//         res.sendSuccess({ token });
//       } catch (error) {
//         res.sendServerError(error.message);
//       }
//     });

//     this.get("/logout", ["USER", "ADMIN"], async (req, res) => {
//       // Aquí iría la lógica para cerrar la sesión del usuario
//       res.clearCookie("token");
//       res.sendSuccess("Logout successful");
//     });
//   }
// }

// module.exports = SessionRouter;

const { Router } = require("express");
const { createHash, generateToken, isValidPassword } = require("../utils");
const passport = require("passport");
const userModel = require("../dao/models/users");
const jwt = require("jsonwebtoken");
const 

const { JWT_SECRET } = require("../config/jwt.config");

const sessionsRouter = Router();

// const users = [
//   { email: "adminCoder@coder.com", role: "admin" },
//   { email: "robert@takena.com", role: "user" },
// ];

// class SessionRouter extends CustomRouter { <---Esto lo dio el procesor como LOGIN--->
//   initilize() {
//     this.post("/userpolicies", ["PUBLIC"], (req, res) => {
//       // let user = {
//       //     email: req.email,
//       //     role: 'user'
//       // }
//       let user = users.find((u = u.email == req.body.email));

//       const token = jwt.sign(user, JWT_SECRET);  // <--- Aqui se genera el token del usuario. Pero ver si no  hay que cambiarlo porque debe ser sino email, password({email, password})--->
//       res.sendSuccess({ token });
//     });
//   }
// }

// O sea, podría ser:
// const token = jwt.sign({ email, password }, JWT_SECRET),  {expiresIn: '2h'})
// res.cookie('rodsCookie', token).send({status: 'success', message: 'Logged in successfully'})
// Luego habría q ver donde poner este resto de la cookie: res.cookie('token', token, {httpOnly: true, maxAge: 1200000})

// LO DE ARRIBA QUEDARÏA ASÏ (acá se guarda el tiken en una cookie): <--- Acá se crea el  token y se lo guarda en forma de cookie--->
// res.cookie('rodsCookie', token, {httpOnly: true}).send({status: 'success', message: 'Logged in successfully'})

// UNA VEZ LA COOKIE CREADA LA PODEMOS SACAR DE NUESTRO REQUEST: req.cookies.rodsCookie

sessionsRouter.post(
  //<--- Esto lo vinmos en clases anteriores --->
  "/register",
  passport.authenticate("register", {
    failureRedirect: "api/sessions.registerFail",
    session: false,
  }),
  (req, res) => {
    res.send({
      status: "success",
      message: "Registered successfully",
    });
  }
);

sessionsRouter.get("/registerFail", (req, res) => {
  res.status(400).send({
    status: "error",
    error: "There was an error registering the user",
  });
});

/** LOGIN */

sessionsRouter.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "api/sessions/loginFail",
    session: false,
  }),
  (req, res) => {
    const { _id, first_name, last_name, role, email, cart, age } = req.user;

    const serializableUser = {
      id: _id,
      first_name,
      last_name,
      role,
      email,
      cart,
      age,
    };
    const token = jwt.sign(serializableUser, JWT_SECRET, {
      expiresIn: "2h",
    });

    // Configurar la cookie con la opción HttpOnly
    res.cookie("rodsCookie", token, { httpOnly: true });

    res.send({
      status: "success",
      message: "Logged in successfully",
    });
  }
);

sessionsRouter.get("/loginFail", (req, res) => {
  res.status(400).send({
    status: "error",
    error: "Login fail",
  });
});

sessionsRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"], session: false }),
  async (req, res) => {}
);

sessionsRouter.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req, res) => {
    const { _id, first_name, last_name, role, email, cart, age } = req.user;
    const serializableUser = {
      id: _id,
      first_name,
      last_name,
      role,
      email,
      cart,
      age,
    };
    const token = jwt.sign(serializableUser, JWT_SECRET, {
      expiresIn: "2h",
    });
    res.cookie("rodsCookie", token);
    res.redirect("/current");
  }
);

sessionsRouter.get("/logout", (req, res) => {
  res.clearCookie("rodsCookie");
  res.send({
    status: "success",
    message: "Logged out successfully",
  });
});

sessionsRouter.post("/resetPassword", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .send({ status: "error", error: "Email and password are required" });
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).send({ status: "error", error: "User not found" });
  }

  /** hasheamos la nueva contraseña */
  const hashedPassword = createHash(password);

  const result = await userModel.updateOne(
    { _id: user._id },
    { $set: { password: hashedPassword } }
  );

  if (!result) {
    return res
      .status(400)
      .send({ status: "error", error: "Password not updated" });
  }

  res.send({
    status: "success",
    message: "Password changed successfully",
    details: result,
  });
});

sessionsRouter.get(
  "/current",
  passport.authenticate("jwt", { session: false }), // Autenticar al usuario utilizando la estrategia "current"
  (req, res) => {
    res.send({
      status: "success",
      message: "Logged in successfully",
      details: {
        user: req.user,
      },
      token: req.cookies.rodsCookie,
    });
    const { _id, first_name, last_name, role, email, cart, age } = req.user;

    const serializableUser = {
      id: _id,
      first_name,
      last_name,
      role,
      email,
      cart,
      age,
    };

    // const token = jwt.sign(serializableUser, JWT_SECRET, {
    //   expiresIn: "2h",
    // });

    // res.cookie("rodsCookie", token, { httpOnly: true });

    res.send({
      status: "success",
      message: "Logged in successfully",
      details: {
        user: req.user,
        token: req.cookies.rodsCookie,
      },
    });

    //<-- /current -->
    // // Una vez que el usuario está autenticado, puedes acceder a él desde req.user
    // const user = req.user; // Obtener el usuario autenticado desde req.user

    // // Generar el token para el usuario autenticado
    // const token = jwt.sign(user.toJSON(), JWT_SECRET, {
    //   expiresIn: "2h", // Establecer la expiración del token
    // });

    // // Configurar la cookie con el token generado
    // res.cookie("rodsCookie", token, { httpOnly: true });

    // // Enviar la respuesta con el usuario autenticado y el token generado
    // res.send({ payload: user, token });
  }
);

module.exports = sessionsRouter;
