const { VersionChecklist, Themes } = require("../models/models");
const ApiError = require("../exceptions/api-error");
const { Op } = require("sequelize");

class ResultService {
  async getActualThemes() {
    const actualId = await VersionChecklist.findOne({
      attributes: ['id'],
      where: { actualKey: 'Актуально' },
    });

    const actualThemes = await Themes.findAll({
      attributes: ['title'],
      where: { versionChecklistId: actualId.dataValues.id }
    });

    console.log(actualThemes);

    return actualThemes;
  }
}

module.exports = new ResultService();
