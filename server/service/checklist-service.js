const { Checklist, ChecklistContent, User, ChecklistFiles } = require("../models/models");
const ApiError = require("../exceptions/api-error");
const ChecklistDto = require("../dtos/checklist-dto");
const { Op } = require("sequelize");
const path = require("path");
const uuid = require("uuid");

async function saveFile(file, id) {
    let fileName = uuid.v4() + ".docx";
      file.mv(
        path.resolve(
          __dirname,
          "..",
          "static/checklist/contents",
          fileName
        )
      );
    await ChecklistFiles.create({
      id: fileName,
      name: file.name,
      checklistId: id,
    });
  }

async function destroyFile(id) {
    const file = await ChecklistFiles.findOne({
      where: { checklistId: id },
    });

    var fs = require("fs");

    if (file) {
      await ChecklistFiles.destroy({
        where: { checklistId: id },
      });
      fs.unlink(path.resolve(
          __dirname,
          "..",
          "static/checklist/contents",
          file.id
        ), function(err) {
        if (err) {
          console.log(err);
        }
      });
    }
  }

class ChecklistService {
  async createChecklist(
    name,
    versionChecklistId,
    description,
    file,
    userId,
    contents
  ) {

    const checklist = await Checklist.create({
      name,
      versionChecklistId,
      description,
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

    saveFile(file, checklist.id);

    const checklistDto = new ChecklistDto(checklist);

    return { checklist: checklistDto };
  }

  async downloadFile(file) {
    const fileItem = await ChecklistFiles.findOne({
      where: { id: file },
    });

    const pathFile = path.resolve(
      __dirname,
      "..",
      "static/checklist/contents",
      fileItem.id
    );

    return { pathFile, fileItem };
  }

  async getAll(limit, offset, versionChecklistId, name) {
    let checklist;
    if (versionChecklistId && name) {
      checklist = await Checklist.findAndCountAll({
        limit,
        offset,
        where: {
          name: { [Op.iLike]: `%${name}%` },
          versionChecklistId: versionChecklistId
        }
      });
    } else if (name) {
      checklist = await Checklist.findAndCountAll({
        limit,
        offset,
        where: {
          name: { [Op.iLike]: `%${name}%` }
        }
      });
    } else if (versionChecklistId) {
      checklist = await Checklist.findAndCountAll({
        limit,
        offset,
        where: {
          versionChecklistId: versionChecklistId
        }
      });
    } else {
      checklist = await Checklist.findAndCountAll({ limit, offset });
    }
    return checklist;
  }

  async getOne(id) {
    const checklist = await Checklist.findOne({
      where: { id },
      include: [
        { model: ChecklistContent, as: "checklist_contents" },
        { model: User, as: "user" },
        { model: ChecklistFiles },
      ],
    });
    return checklist;
  }

  async deleteOne(id) {
    await Checklist.destroy({
      where: { id },
    });
  }

  async updateOne(id, name, versionChecklistId, description, contents) {
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

    if (contents) {
      const candidateContent = await ChecklistContent.findOne({
        where: { checklistId: id },
      });
      const oldContents = await ChecklistContent.findAll({
        where: { checklistId: id },
      });
      const newContents = JSON.parse(contents);

      if (candidateContent) {
        oldContents.forEach((oldItem) => {
          if (newContents.find((el) => el.id == oldItem.id)) {
            console.log("\n\nСОВПАДЕНИЕ!\n\n", `UPDATE ${oldItem.id}`);
            let updateContent = newContents.find(
              (el) => el.id == oldItem.id
            ).content;
            ChecklistContent.update(
              {
                content: updateContent,
                checklistId: id,
              },
              {
                where: { id: oldItem.id },
              }
            );
          } else {
            console.log(`\n\nУДАЛЯЕМ ${oldItem.id}\n\n`);
            ChecklistContent.destroy({
              where: { id: oldItem.id },
            });
          }
        });
        newContents.forEach((item) => {
          if (!oldContents.find((el) => el.id == item.id)) {
            console.log(`\n\nCREATE NEW CONTENT ${item.id}\n\n`);
            ChecklistContent.create({
              content: item.content,
              checklistId: id,
            });
          }
        });
      } else {
        newContents.forEach((i) =>
          ChecklistContent.create({
            content: i.content,
            checklistId: id,
          })
        );
      }
    }
  }
}

module.exports = new ChecklistService();
