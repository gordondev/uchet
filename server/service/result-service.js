const { VersionChecklist, Themes, Checklist } = require("../models/models");
const ApiError = require("../exceptions/api-error");
const { Op } = require("sequelize");


async function getActualId() {
  const actualId = await VersionChecklist.findOne({
    attributes: ['id'],
    where: { actualKey: 'Актуально' },
  });

  return actualId.dataValues.id;
}

class ResultService {
  async getActualThemes() {
    const actualId = await getActualId();

    const actualThemes = await Themes.findAll({
      attributes: ['title', 'id'],
      where: { versionChecklistId: actualId }
    });

    return actualThemes;
  }
  async getActualChecklists() {

    const actualId = await getActualId();
    const actualChecklists = await Checklist.findAll({
      attributes: ['name'],
      where: { versionChecklistId: actualId }
    });

    return actualChecklists;
  }
}

module.exports = new ResultService();
