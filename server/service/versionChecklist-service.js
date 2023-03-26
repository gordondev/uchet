const { VersionChecklist } = require("../models/models");
const VersionChecklistDto = require("../dtos/versionChecklist-dto");
const ApiError = require("../exceptions/api-error");

class VersionChecklistService {
  async createVersionChecklist(
    id,
    actual_key,
    userId,
    quanity_type,
    reason_for_use,
    comment
  ) {
    const candidate = await VersionChecklist.findOne({ where: { id } });
    if (candidate) {
      throw ApiError.BadRequest(
        `Версия чек-листа с номером ${email} уже существует`
      );
    }

    const versionChecklist = await VersionChecklist.create({
      id,
      actual_key,
      userId,
      quanity_type,
      reason_for_use,
      comment,
    });

    const versionChecklistDto = new VersionChecklistDto(versionChecklist);

    return { versionChecklist: versionChecklistDto };
  }

  async getAll() {
    const versionChecklists = await VersionChecklist.findAll();
    return versionChecklists;
  }

  async getOne(id) {
    const versionChecklist = await VersionChecklist.findOne({
      where: { id },
    });
    return versionChecklist;
  }

  async deleteOne(id) {
    const versionChecklists = await VersionChecklist.destroy({
      where: { id },
    });
    return versionChecklists;
  }
}

module.exports = new VersionChecklistService();
