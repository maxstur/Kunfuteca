const privateAccess = (req, res, next) => {
    next();
};
module.exports = privateAccess