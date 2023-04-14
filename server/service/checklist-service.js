const { Checklist } = require("../models/models");
const ApiError = require("../exceptions/api-error");
const ChecklistDto = require("../dtos/checklist-dto");
const path = require("path");
const uuid = require("uuid");


class ChecklistService {
  async createChecklist(
    id,
    name,
    versionChecklistId,
    description,
    file,
    userId
  ) {
    const candidate = await Checklist.findOne({ where: { id } });

    if (candidate) {
      throw ApiError.BadRequest(
        `чек-лист с номером ${id} уже существует`
      );
    }

    let fileName = uuid.v4() + ".docx";

    if (file != null) {
      file.mv(
        path.resolve(
          __dirname,
          "..",
          "static/checklist/contents",
          file
        )
      );
    }

    const checklist = await Checklist.create({
      id,
      name,
      versionChecklistId,
      description,
      file: file ? fileName : file,
      userId,
    });

    const checklistDto = new ChecklistDto(checklist);

    return { checklist: checklistDto };
  }
}

module.exports = new ChecklistService();