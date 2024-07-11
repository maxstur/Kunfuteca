const checkRole = (role) => (req, res, next) => {
  if (req.user.role != role) {
    return res.status(401).send({
      status: "error",
      error: `Not authorized, You are not an ${role}`, // o user.role
    });
  }
  next();
};

const checkAdmin = (req, res, next) => {
  const user = req.user;
  if (user.role != "ADMIN") {
    return res.status(401).send({
      status: "error",
      error: `Not authorized, You are not an ${role}`,
    });
  }
  next();
};

const checkUser = (req, res, next) => {
  const user = req.user;
  if (user.role != "USER") {
    return res.status(401).send({
      status: "error",
      error: `Not authorized, You are not an ${role}`,
    });
  }
  next();
};

module.exports = checkRole;
