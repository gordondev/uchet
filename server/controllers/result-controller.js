const result = require("../service/result-service");
const ApiError = require("../exceptions/api-error");

class ResultController {
  async getActualThemes(req, res, next) {
    try {
      const resultData = await result.getActualThemes();
      return res.json(resultData);
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }
}

module.exports = new ResultController();
