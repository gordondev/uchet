const { VersionChecklist } = require("../models/models");
const ApiError = require("../exceptions/api-error");
const { Op } = require("sequelize");

class ResultService {
  async getActualThemes() {
    console.log("WORKED...");
    // const versionQuanity = await VersionChecklist.findOne({
    // 	where: { id: versionChecklistId }
    // });
  }
}

module.exports = new ResultService();
