const passport = require("passport");
const jwt = require("passport-jwt");
const GithubStrategy = require("passport-github2");
const Local = require("passport-local");
const userModel = require("../dao/models/users");
const JWT_SECRET = 'passportJwtSecret';

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

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: "Iv1.99c8943a5483aae9",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
        clientSecret: "a2353def9458d4f3ff9c9d6b92a48d23fb7a4717",
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
              age: 0,
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

  password.use('jwt', new jwt.Strategy({
    secretOrKey: JWT_SECRET, 
    jwtFromRequest: jwt.ExtractJwt.fromExtractors([cookieExtractor])
  }, (jwt_payload, done)=>{
    try {
      //Possible custom error
      //done(null, false, {messages:'User doesn`t exist.'})
      return done(null, jwt_payload); //done(null, false)
    } catch (error) {
      return done(error)
    }
  }))
};

function cookieExtractor(req){
  let token = null;
  if(req.cookies.rodsCookie){
    token = req.cookie.rodsCookie;
  }
  return token;
}

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (userId, done) => {
  let user = await userModel.findOne({ _id: userId });
  done(null, user);
});

module.exports = {initializePassport, JWT_SECRET}
