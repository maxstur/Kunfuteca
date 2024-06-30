const privateAccess = (req, res, next) => {
    const user = req.user;
    if (!user || !user.id) {
        return res.status(401).json({ status: "error", error: "Not authorized" });
    }
    next();
};

module.exports = privateAccess;
