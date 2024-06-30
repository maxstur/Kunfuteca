const passport = require("passport");
const local = require("passport-local");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const github = require("passport-github2");
const userModel = require("../dao/models/users");
const { createdHash, isValidPassword} = require("../utils");

/** Configs */
const {
  JWT_PRIVATE_KEY,
  EMAIL_ADMIN_1,
  PASSWORD_ADMIN_1,
  EMAIL_ADMIN_2,
  PASSWORD_ADMIN_2,
  EMAIL_ADMIN_3,
  PASSWORD_ADMIN_3,
} = require("../config/environment.config");

function cookieExtractor(req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["rodsCookie"];
  }
  return token;
}

const initializePassport = () => {
  passport.use(
    new JwtStrategy(
      {
        secretOrKey: JWT_PRIVATE_KEY,
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      },
      async (payload, done) => {
        try {
          const user = await userModel.findById(payload.user._id);

          if (!user) {
            return done(null, false, {
              message: "Have you registered? Invalid token",
            });
          }

          return done(null, user);
        } catch (error) {
          console.error("Error in passport config", error);
          return done(error);
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
          const { first_name, last_name, age} = req.body;

          // Validamos los campos
          if (!first_name || !last_name || !email || !password || !age) {
            return done(null, false, { message: "All fields are required" });
          }

          // Verificamos si el usuario ya existe
          const existingUser = await userModel.findOne({ email });
          if (existingUser) {
            return done(null, false, {
              alert: "User with that email already exists, please login",
            });
          }

          // Verificamos el rol del usuario
          let role;
          if (
            (email == EMAIL_ADMIN_1 && password == PASSWORD_ADMIN_1) ||
            (email == EMAIL_ADMIN_2 && password == PASSWORD_ADMIN_2) ||
            (email == EMAIL_ADMIN_3 && password == PASSWORD_ADMIN_3)
          ) {
            role = "admin";
          } else {
            role = "user";
          }

          // Creamos un nuevo usuario
          const newUserData = {
            first_name,
            last_name,
            email,
            age,
            password: createdHash(password),
            role,
          };

          // Creamos el usuario
          const result = await userModel.create(newUserData);

          // Retornamos el usuario
          return done(null, result.toObject());
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
    new github.Strategy(
      {
        clientID: "Iv1.2f5a0a5c1e5b1f5",
        clientSecret: "a2353def9458d4f3ff9c9d6b92a48d23fb7a4717",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
        session: false,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await userModel.findOne({ email: profile._json.email });
          if (!user) {
            const adminEmails = [EMAIL_ADMIN_1, EMAIL_ADMIN_2, EMAIL_ADMIN_3];
            let role = "user";
            if (adminEmails.includes(profile._json.email)) {
              role = "admin";
            }
            let newUserData = {
              first_name: profile._json.name,
              last_name: "",
              email: profile._json.email,
              age: 21 || 0,
              role: role || "user",
              cart: [],
            };
        
            let result = await userModel.create(newUserData);
            
            return done(null, result);
          } else {
            return done(null, user /**false, { message: "User already exists" }*/);
          }
          
        } catch (error) {
          console.error("Error during GitHub user authentication:", error);
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
