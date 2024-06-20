
const publicAccess = (req, res, next) => {
    if (!req.user) {
        return res.status(200).send({ status: 'success', message: "There are premium content for users who have an account" });
    }
    next();
};  

module.exports = publicAccess