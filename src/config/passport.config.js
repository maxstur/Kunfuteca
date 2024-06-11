const passport = require("passport");
const jwt = require("jsonwebtoken");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const GithubStrategy = require("passport-github2");
const userModel = require("../dao/models/users");
const local = require("passport-local");
const { createdHash, isValidPassword } = require("../utils");
const { JWT_PRIVATE_KEY } = require("../config/environment.config");

function cookieExtractor(req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["rodsCookie"];
  }
  return token;
}

const initializePassport = () => {
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        secretOrKey: JWT_PRIVATE_KEY,
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      },
      async (jwt_payload, done) => {
        try {
          const user = await userModel.findById(jwt_payload.user._id);

          if (!user) {
            return done(null, false, {
              message: "Have you registered? Invalid token",
            });
          }
          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );

  passport.use(
    "register",
    new local.Strategy(
      {
        passReqToCallback: true,
        usernameField: "email",
        session: false,
      },
      async (req, email, password, done) => {
        try {
          const { first_name, last_name, age } = req.body;
          let { role } = req.body;

          // Validar los campos
          if (!first_name || !last_name || !age)
            return done(null, false, { message: "All fields are required" });
          const existingUser = await userModel.findOne({ email });
          if (existingUser) {
            return done(null, false, {
              message: "User with that email already exists",
            });
          }
          // Verificar el rol del usuario
          if (email == "adminCoder@coder.com" && password == "adminCod3r123") {
            role = "admin";
          } else {
            role = "user";
          }
          // Crear un nuevo usuario
          const newUserData = {
            first_name,
            last_name,
            email,
            age,
            password: createdHash(password),
            role,
          };
          // Crear el usuario
          let result = await userModel.create(newUserData);
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new local.Strategy(
      {
        usernameField: "email",
        session: false,
      },
      async (email, password, done) => {
        try {
          const user = await userModel.findOne({ email });
          if (!user) {
            return done(null, false, {
              message: "User not found or doesn't exist",
            });
          }
          if (!isValidPassword(user, password)) {
            return done(null, false, { message: "Invalid password" });
          }

          return done(null, user);
        } catch (error) {
          console.error("Error during user authentication:", error);
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: "Iv1.99c8943a5483aae9",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
        clientSecret: "a2353def9458d4f3ff9c9d6b92a48d23fb7a4717",
        session: false,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let role = "user";
          if (profile._json.email == "adminCoder@coder.com") {
            role = "admin";
          }
          const user = await userModel.findOne({ email: profile._json.email });

          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: 21,
              email: profile._json.email,
              role,
            };
            let result = await userModel.create(newUser);
            return done(null, result);
          } else {
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (userId, done) => {
  let user = await userModel.findById({ _id: userId });
  done(null, user);
});

module.exports = initializePassport;
