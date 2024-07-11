const checkRole = (role) => (req, res, next) => {
  if (req.user.role != role) {
    return res.status(401).send({
      status: "error",
      error: `Not authorized, You are not an ${role}`, // o user.role
    });
  }
  next();
};

module.exports = checkRole;
