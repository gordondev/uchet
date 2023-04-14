const { Checklist, ChecklistContent, User } = require("../models/models");
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
    userId,
    contents
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

    if (contents) {
      contents = JSON.parse(contents);
      contents.forEach((i) =>
        ChecklistContent.create({
          name: i.name,
          checklistId: id,
        })
      );
    }

    const checklistDto = new ChecklistDto(checklist);

    return { checklist: checklistDto };
  }

  async getAll(limit, offset) {
    const checklist = await Checklist.findAndCountAll({ limit, offset });
    return checklist;
  }

  async getOne(id) {
    const checklist = await Checklist.findOne({
      where: { id },
      include: [{model: ChecklistContent, as: 'checklist_contents'}, {model: User, as: 'user'}],
    });
    return checklist;
  }

  async deleteOne(id) {
    await Checklist.destroy({
      where: { id },
    });
  }

  async updateOne(
    updateId,
    id,
    name,
    versionChecklistId,
    description,
    file,
    userId,
    contents
  ) {

    const candidate = false;

    if (updateId != id) {
      const candidate = await Checklist.findOne({ where: { id: updateId } });      
    }

    if (candidate) {
      throw ApiError.BadRequest(
        `Чек-лист с номером ${id} уже существует`
      );
    }

    const checklist = await Checklist.update(
      {
        id: updateId,
        name: name,
        versionChecklistId: versionChecklistId,
        description: description,
      },
      {
        where: { id },
      }
    );

    const candidateContent = await ChecklistContent.findOne({ where: { checklistId: updateId } });

    if (candidateContent) {
      if (contents) {
        contents = JSON.parse(contents);
        contents.forEach((i) =>
          ChecklistContent.update({
            name: i.name,
            checklistId: updateId,
          },
          {
            where: { id },
          })
        );
      }
    } else if (contents) {
      contents = JSON.parse(contents);
      contents.forEach((i) =>
        ChecklistContent.create({
          name: i.name,
          checklistId: updateId,
        })
      );
    }

  }

}

module.exports = new ChecklistService();