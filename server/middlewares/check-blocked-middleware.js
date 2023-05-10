const ApiError = require("../exceptions/api-error");


module.exports = function (req, res, next) {
  try {
    const { user } = req;
    console.log("MIDDLEWARE");
    next();
  } catch (e) {
    return next(ApiError.UnauthorizedError());
  }
};