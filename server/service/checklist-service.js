const {
  Checklist,
  ChecklistContent,
  User,
  ChecklistFiles,
  VersionChecklist,
  Themes,
} = require("../models/models");
const ApiError = require("../exceptions/api-error");
const ChecklistDto = require("../dtos/checklist-dto");
const { Op } = require("sequelize");
const path = require("path");
const uuid = require("uuid");
const mime = require('mime-types')
const fileTypeDocx = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const fileTypeDoc = "application/msword";
const filePath = "static/checklist/contents";

async function saveFile(file, id) {
  let fileId = uuid.v4();
  let fileName;
  if (mime.contentType(file.name) === fileTypeDocx) {
    fileName = fileId + ".docx";
  } else {
    fileName = fileId + ".doc";
  }

  file.mv(path.resolve(__dirname, "..", filePath, fileName));

  await ChecklistFiles.create({
    id: fileId,
    fileName: file.name,
    filePath: filePath,
    fileSize: file.size,
    fileExtension: file.name.split(".").pop(),
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
    fs.unlink(
      path.resolve(__dirname, "..", filePath, file.id + "." + file.fileExtension),
      function (err) {
        if (err) {
          console.log(err);
        }
      }
    );
  }
}

function checkFileExtension(file) {
  if (file != null) {
    const fileType = mime.contentType(file.name);
    if (fileType != fileTypeDocx && fileType != fileTypeDoc) {
      throw ApiError.BadRequest(
        `${file.name} не является .doc или docx`
      );
    }
  }
}

async function checkRepeatName(themeId, versionChecklistId) {
  const nameChecklist = await Checklist.findOne({
    where: { themeId: themeId, versionChecklistId: versionChecklistId },
  });

  if (nameChecklist) {
    throw ApiError.BadRequest(`Название с данной версией уже существует`);
  }
}

class ChecklistService {
  async createChecklist(
    themeId,
    versionChecklistId,
    description,
    file,
    userId,
    contents
  ) {

    checkFileExtension(file);

    const versionQuanity = await VersionChecklist.findOne({
      where: { id: versionChecklistId },
    });

    if (!versionQuanity) {
      throw ApiError.BadRequest(`Данной версии не существует`);
    }

    await checkRepeatName(themeId, versionChecklistId);

    const numberOfRecordsAvailable = await Checklist.count({
      where: { versionChecklistId: versionChecklistId },
    });

    if (numberOfRecordsAvailable >= versionQuanity.quanityType) {
      throw ApiError.BadRequest(
        `Превышенно количество чек-листов с данной версией`
      );
    }

    const checklist = await Checklist.create({
      themeId,
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

    if (file != null) {
      saveFile(file, checklist.id);
    }

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
      filePath,
      fileItem.id + "." + fileItem.fileExtension
    );

    return { pathFile, fileItem };
  }

  async getAll(limit, offset, versionChecklistId, title) {
    const where = {};
    if (title) {
        where["$theme.title$"] = { [Op.iLike]: `%${title}%` };
    }
    if (versionChecklistId) {
        where.versionChecklistId = versionChecklistId;
    }

    const checklist = await Checklist.findAndCountAll({
        limit,
        offset,
        where,
        include: [
          { model: Themes, as: "theme" },
        ],
    });
    return checklist;
  } 

  async getOne(id) {
    const checklist = await Checklist.findOne({
      where: { id },
      include: [
        { model: ChecklistContent, as: "checklist_contents" },
        { model: User, as: "user" },
        { model: ChecklistFiles },
        { model: Themes },
      ],
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
    themeId,
    versionChecklistId,
    description,
    contents,
    file,
    fileIsDeleted
  ) {
    
    checkFileExtension(file);
    const nameChecklist = await Checklist.findOne({
      where: { id: id, themeId: themeId },
    });
    if (!nameChecklist) {
      await checkRepeatName(themeId, versionChecklistId);
    }
    
    const checklist = await Checklist.update(
      {
        themeId: themeId,
        versionChecklistId: versionChecklistId,
        description: description,
      },
      {
        where: { id },
      }
    );

    if (file != null) {
      await destroyFile(id);
      await saveFile(file, id);
    } else if (Boolean(fileIsDeleted)) {
      await destroyFile(id);
    }

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
          const newContent = newContents.find((el) => el.id === oldItem.id);
          if (newContent) {
            ChecklistContent.update(
              { content: newContent.content, checklistId: id },
              { where: { id: oldItem.id } }
            );
          } else {
            ChecklistContent.destroy({ where: { id: oldItem.id } });
          }
        });
        newContents.forEach((item) => {
          if (!oldContents.find((el) => el.id === item.id)) {
            ChecklistContent.create({ content: item.content, checklistId: id });
          }
        });
      } else {
        newContents.forEach((item) => {
          ChecklistContent.create({ content: item.content, checklistId: id });
        });
      }
    }
  }
}

module.exports = new ChecklistService();
