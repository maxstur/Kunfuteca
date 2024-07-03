const passport = require("passport");
const LocalStrategy = require("passport-jwt").Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const GithubStrategy = require("passport-github2");
const userModel = require("../dao/models/users");
const { createdHash, isValidPassword } = require("../utils");
const {
  JWT_PRIVATE_KEY,
  EMAIL_ADMIN_1,
  EMAIL_ADMIN_2,
  EMAIL_ADMIN_3,
  PASSWORD_CHARSET,
} = require("../config/environment.config");

function cookieExtractor(req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["rodsCookie"];
  }
  return token;
}

const initializePassport = () => {
  const jwtOptions = {
    secretOrKey: JWT_PRIVATE_KEY,
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
  };

  passport.use(
    new JwtStrategy(jwtOptions, async (payload, done) => {
      try {
        const user = await userModel.findById(payload.user._id);
        return user ? done(null, user) : done(null, false, { message: "Invalid token" });
      } catch (error) {
        console.error("Error in JWT strategy:", error);
        done(error);
      }
    })
  );

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
          const { firstName, lastName, age } = req.body;

          if (!firstName || !lastName || !email || !password || !age) {
            return done(null, false, { message: "All fields are required" });
          }

          const existingUser = await userModel.findOne({ email });
          if (existingUser) {
            return done(null, false, { message: "User already exists" });
          }

          const role = email === EMAIL_ADMIN_1 || email === EMAIL_ADMIN_2 || email === EMAIL_ADMIN_3 ? "admin" : "user";

          const newUser = {
            firstName,
            lastName,
            email,
            age,
            password: createdHash(password),
            role,
            cart: [],
          };

          const result = await userModel.create(newUser);
          return done(null, result, { message: "User registered successfully" });
        } catch (error) {
          console.error("Error during user registration:", error);
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
        secretOrKey: JWT_PRIVATE_KEY,
      },
      async (email, password, done) => {
        try {
          const user = await userModel.findOne({ email });
          if (!user || !isValidPassword(user, password)) {
            return done(null, false, { message: "Invalid credentials" });
          }

          return done(null, user);
        } catch (error) {
          console.error("Error during user authentication:", error);
          done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: "Iv1.2f5a0a5c1e5b1f5",
        clientSecret: "a2353def9458d4f3ff9c9d6b92a48d23fb7a4717",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
        session: false,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await userModel.findOne({ email: profile._json.email });
          if (!user) {
            const newUser = {
              firstName: profile._json.name,
              lastName: "",
              email: profile._json.email,
              age: 21 || 0,
              role: [EMAIL_ADMIN_1, EMAIL_ADMIN_2, EMAIL_ADMIN_3].includes(profile._json.email) ? "admin" : "user",
              cart: [],
            };

            const result = await userModel.create(newUser);
            return done(null, result);
          }
          return done(null, user);
        } catch (error) {
          console.error("Error during GitHub user authentication:", error);
          done(error);
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
