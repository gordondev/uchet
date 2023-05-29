
const ApiError = require("../exceptions/api-error");
const { sequelize, ObservationResults } = require("../models/models");
module.exports = { sequelize, ObservationResults };
const { Op, fn, col } = require("sequelize");

class ChartService {
  async getAllCountResults() {
      const countByDivision = await ObservationResults.findAll({
        attributes: [
          ['division', 'Подразделение'],
          [fn('COUNT', col('division')), 'Количество']
        ],
        group: ['division'],
      });

      return countByDivision;
  }
}

module.exports = new ChartService();
