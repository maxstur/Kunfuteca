const passport = require("passport");
const GithubStrategy = require("passport-github2");
const local = require("passport-local");
const userModel = require("../dao/models/users");
const { createHash, isValidPassword } = require("../utils");
const { JWT_SECRET } = require("../config/jwt.config");
const jwt = require("jsonwebtoken");
const { cookieExtractor } = require("../config/passport.config");
const { ExtractJwt, Strategy: JwtStrategy } = require("passport-jwt");

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
        session: false,
      },
      async (req, email, password, done) => {
        try {
          const { first_name, last_name } = req.body;
          if (!first_name || !last_name)
            return done(null, false, { message: "Invalid parameters" });

          const existingUser = await userModel.findOne({ email });
          if (existingUser)
            return done(null, false, {
              message: "User with that email already exists",
            });

          const newUserData = {
            first_name,
            last_name,
            email,
            password: createHash(password),
          };

          let result = await userModel.create(newUserData);
          return done(null, result);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        session: false,
      },
      async (email, password, done) => {
        try {
          const user = await userModel.findOne({ email });
          if (!user) {
            return done(null, false, { message: "User not found" });
          }
          if (!isValidPassword(user, password)) {
            return done(null, false, { message: "Invalid password" });
          }
          return done(null, user);
        } catch (error) {
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
          const user = await userModel.findOne({ email: profile._json.email });

          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              email: profile._json.email,
            };
            let result = await userModel.create(newUser);
            return done(null, result);
          } else {
            return done(null, user);
          }
          return done(null, false);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "current",
    new JwtStrategy(
      {
        secretOrKey: JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      },
      async (jwtPayload, done) => {
        try {
          const user = await userModel.findOne({ _id: jwtPayload._id });

          if (!user) {
            return done(null, false);
          }
          // Si el usuario existe, devuélvelo
          return done(null, user);
        } catch (error) {
          // Si hay un error, devuélvelo
          return done(error, false);
        }
      }
    )
  );

};

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (userId, done) => {
  let user = await userModel.findOne({ _id: userId });
  done(null, user);
});

module.exports = initializePassport;
