

const chart = require("../service/chart-service");
const ApiError = require("../exceptions/api-error");

class ChartController {
  
  async getAllCountResults(req, res, next) {
    try {
      const resultsData = await chart.getAllCountResults();

      return res.json(resultsData);
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }
}

module.exports = new ChartController();
