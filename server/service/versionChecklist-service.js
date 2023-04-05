const { VersionChecklist } = require("../models/models");
const VersionChecklistDto = require("../dtos/versionChecklist-dto");
const ApiError = require("../exceptions/api-error");
const path = require('path');
const uuid = require("uuid");

class VersionChecklistService {
  async createVersionChecklist(
    id,
    actual_key,
    userId,
    quanity_type,
    reason_for_use,
    comment,
    header_file,
    comment_file
  ) {
    const candidate = await VersionChecklist.findOne({ where: { id } });
    if (candidate) {
      throw ApiError.BadRequest(
        `Версия чек-листа с номером ${email} уже существует`
      );
    }
    let fileName = uuid.v4() + ".docx";
    header_file.mv(path.resolve(__dirname, '..', 'static/versionChecklist/headerFiles', fileName));
    comment_file.mv(path.resolve(__dirname, '..', 'static/versionChecklist/commentFiles', fileName));

    const versionChecklist = await VersionChecklist.create({
      id,
      actual_key,
      userId,
      quanity_type,
      reason_for_use,
      comment,
      header_file: fileName,
      comment_file: fileName
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
    updateId,
    id,
    actual_key,
    userId,
    quanity_type,
    reason_for_use,
    comment
  ) {
    console.log(`\n\n\n${id}\n\n\n`);
    const versionChecklist = await VersionChecklist.update(
      {
        id: updateId,
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
  }
}

module.exports = new VersionChecklistService();
