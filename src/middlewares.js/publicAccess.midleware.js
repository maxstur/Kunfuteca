const publicAccess = (req, res, next) => {
    next();
};
module.exports = publicAccess;