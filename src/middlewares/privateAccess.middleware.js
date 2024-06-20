const privateAcces = (req, res, next) => {
    if (!req.user) {
        return res.status(401).send({ status: "error", error: "Not authorized" });
    }
    next();
};

module.exports = privateAcces