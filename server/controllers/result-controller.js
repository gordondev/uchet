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
  async getActualChecklists(req, res, next) {
    try {
      const resultData = await result.getActualChecklists();
      return res.json(resultData);
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }
  async create(req, res, next) {
    try {
      const { workInProgress, impactOnSave, themes, comment, finalGrade, division } =
        req.body;
      console.log(finalGrade);
      console.log(comment);
      console.log(division);
      console.log(workInProgress);
      console.log(impactOnSave);
      console.log(themes);
      return res.json("SUCCESS");
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }
}

module.exports = new ResultController();
