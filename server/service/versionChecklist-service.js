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
    await VersionChecklist.destroy({
      where: { id },
    });
  }

  async updateOne(
    id,
    actual_key,
    userId,
    quanity_type,
    reason_for_use,
    comment
  ) {
    const versionChecklist = await VersionChecklist.update(
      {
        id: id,
        actual_key: actual_key,
        userId: userId,
        quanity_type: quanity_type,
        reason_for_use: reason_for_use,
        comment: comment,
      },
      {
        where: { id },
      }
    );
    const versionChecklistDto = new VersionChecklistDto(versionChecklist);
  }
}

module.exports = new VersionChecklistService();
