const { Checklist, ChecklistContent, User } = require("../models/models");
const ApiError = require("../exceptions/api-error");
const ChecklistDto = require("../dtos/checklist-dto");
const path = require("path");
const uuid = require("uuid");


class ChecklistService {
  async createChecklist(
    name,
    versionChecklistId,
    description,
    file,
    userId,
    contents
  ) {

    let fileName = uuid.v4() + ".docx";

    if (file != null) {
      file.mv(
        path.resolve(
          __dirname,
          "..",
          "static/checklist/contents",
          fileName
        )
      );
    }

    const checklist = await Checklist.create({
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
          content: i.content,
          checklistId: checklist.id,
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
    id,
    name,
    versionChecklistId,
    description,
    file,
    userId,
    contents
  ) {

    const checklist = await Checklist.update(
      {
        name: name,
        versionChecklistId: versionChecklistId,
        description: description,
      },
      {
        where: { id },
      }
    );

    const candidateContent = await ChecklistContent.findOne({ where: { checklistId: id } });

    if (candidateContent) {
      if (contents) {
        contents = JSON.parse(contents);
        contents.forEach((i) =>
          ChecklistContent.update({
            content: i.content,
            checklistId: id,
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
          content: i.content,
          checklistId: id,
        })
      );
    }

  }

}

module.exports = new ChecklistService();