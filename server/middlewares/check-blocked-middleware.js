const ApiError = require("../exceptions/api-error");
const tokenService = require("../service/token-service");
const userService = require("../service/user-service");

async function getUserData(id) {
    try {
      const data = await userService.getUser(id);
      return data;
    } catch (e) {
      next(e);
    }
  }

module.exports = async function (req, res, next) {
  try {
    const idUser = tokenService.validateRefreshToken(req.headers.cookie.replace('refreshToken=', '')).id;
    if (idUser) {
      const data = await getUserData(idUser);
      if (data.dataValues.isBlocked) {
        return next(ApiError.ForbiddenError());
      }
    }
    next();
  } catch (e) {
    return next(e);
  }
};