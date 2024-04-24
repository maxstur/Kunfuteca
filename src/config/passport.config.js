const passport = require("passport");
const GithubStrategy = require('passport-github2');
const Local = require("passport-local");
const userModel = require("../dao/models/users");
const { createHash, isValidPassword } = require("../utils");

const LocalStrategy = Local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age, role } = req.body;

        let user = await userModel.findOne({ email: username });

        try {
          if (user) {
            return done(null, false);
          }

          // Verificar el rol del usuario
          if (email == "adminCoder@coder.com" && password == "adminCod3r123") {
            role = "admin";
          } else {
            role = "user";
          }

          // Crear un nuevo usuario
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            confirm_password: createHash(password),
            role,
          };

          // Crear el usuario
          const result = await userModel.create(newUser);

          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          const user = await userModel.findOne({ email });
          if (!user) {
            return done(null, false);
          }
          if (!isValidPassword(user, password)) {
            return done(null, false);
          }
          return done(null, user);
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
  let user = await userModel.findOne({_id: userId});
  done(null, user);
});

module.exports = initializePassport;
