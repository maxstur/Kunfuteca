const passport = require("passport");
const LocalStrategy = require("passport-jwt").Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const GithubStrategy = require("passport-github2");
const userModel = require("../dao/models/user");
const { createdHash, isValidPassword } = require("../utils");
const {
  JWT_PRIVATE_KEY,
  EMAIL_ADMIN_1,
  EMAIL_ADMIN_2,
  EMAIL_ADMIN_3,
} = require("../config/environment.config");

// const cookieExtractor = function(req) {
//   let token = null;
//   if (req && req.cookies) {
//     token = req.cookies["authToken"];
//   }
//   return token;
// }
const extractors = [
  (req) => req?.cookies?.authToken,
  (req) => req?.headers?.authorization?.split(" ")[1],
];

const initializePassport = () => {
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        secretOrKey: JWT_PRIVATE_KEY,
        jwtFromRequest: ExtractJwt.fromExtractors([...extractors]),
        passReqToCallback: true,
        session: false,
      },
      async (jwtPayload, done) => {
        try {
          const user = await userModel.findById(jwtPayload.user._id);
          if (!user) {
            return done(null, false, {
              message: "Have you registered? Invalid token",
            });
          }
          return done(null, user);
        } catch (error) {
          console.log("Error in passport config", error);
          return done(error, false);
        }
      }
    )
  );

  // passport.use(
  //   "register",
  //   new LocalStrategy(
  //     {
  //       secretOrKey: JWT_PRIVATE_KEY,
  //       jwtFromRequest: ExtractJwt.fromExtractors([...extractors]),
  //       passReqToCallback: true,
  //       usernameField: "email",
  //       session: false,
  //     },
  //     async (req, email, password, done) => {
  //       try {
  //         const { firstName, lastName, age } = req.body;

  //         if (!firstName || !lastName || !email || !password || !age) {
  //           return done(null, false, { message: "All fields are required" });
  //         }

  //         const existingUser = await userModel.findOne({ email });
  //         if (existingUser) {
  //           return done(null, false, { message: "User already exists" });
  //         }

  //         const role = email === EMAIL_ADMIN_1 || email === EMAIL_ADMIN_2 || email === EMAIL_ADMIN_3 ? "admin" : "user";

  //         const newUser = {
  //           firstName,
  //           lastName,
  //           email,
  //           age,
  //           password: createdHash(password),
  //           role,
  //           cart: [],
  //         };

  //         const result = await userModel.create(newUser);
  //         return done(null, result, { message: "User registered successfully" });
  //       } catch (error) {
  //         console.error("Error during user registration:", error);
  //         done(error);
  //       }
  //     }
  //   )
  // );

  // passport.use(
  //   "login",
  //   new LocalStrategy(
  //     {
  //       usernameField: "email",
  //       session: false,
  //       secretOrKey: JWT_PRIVATE_KEY,
  //       jwtFromRequest: ExtractJwt.fromExtractors([...extractors]),
  //     },
  //     async (email, password, done) => {
  //       try {
  //         console.log("email", email, "password", password);
  //         const user = await userModel.findOne({ email });
  //         if (!user || !isValidPassword(user, password)) {
  //           console.log("User: ", user, "Invalid credentials");
  //           return done(null, false, { message: "Invalid credentials" });
  //         }

  //         return done(null, user);
  //       } catch (error) {
  //         console.error("Error during user authentication:", error);
  //         done(error);
  //       }
  //     }
  //   )
  // );

  passport.use(
    "local",
    new LocalStrategy(
      {
        secretOrKey: JWT_PRIVATE_KEY,
        jwtFromRequest: ExtractJwt.fromExtractors([...extractors]),
        usernameField: "email",
        session: false,
      },
      async (email, password, done) => {
        try {
          const user = await userModel.findOne({ email });
          if (!user || !isValidPassword(user, password)) {
            return done(null, false, { message: "Invalid credentials" });
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
              // role: [EMAIL_ADMIN_1, EMAIL_ADMIN_2, EMAIL_ADMIN_3].includes(
              //   profile._json.email
              // )
              //   ? "admin"
              //   : "user",
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
  let user = await userModel.findById({ _id: userId });
  done(null, user);
});

module.exports = initializePassport;
