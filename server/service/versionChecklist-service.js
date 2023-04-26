const { VersionChecklist, Themes, User, HeaderFiles, CommentFiles } = require("../models/models");
const VersionChecklistDto = require("../dtos/versionChecklist-dto");
const ApiError = require("../exceptions/api-error");
const { Op } = require("sequelize");
const path = require("path");
const uuid = require("uuid");

class VersionChecklistService {
  async createVersionChecklist(
    id,
    actualKey,
    userId,
    quanityType,
    reasonForUse,
    acceptanceDate,
    comment,
    headerFile,
    commentFile,
    theme,
    title
  ) {
    const candidate = await VersionChecklist.findOne({ where: { id } });

    if (candidate) {
      throw ApiError.BadRequest(
        `Версия чек-листа с номером ${id} уже существует`
      );
    }
    if (actualKey == "Актуально") {
      VersionChecklist.update(
        { actualKey: "Не актуально" },
        { where: { actualKey: "Актуально" } }
      );
    }

    let fileName = uuid.v4() + ".docx";

    const versionChecklist = await VersionChecklist.create({
      id,
      actualKey,
      userId,
      quanityType,
      reasonForUse,
      acceptanceDate,
      comment,
      title
    });

    if (headerFile != null) {
      headerFile.mv(
        path.resolve(
          __dirname,
          "..",
          "static/versionChecklist/headerFiles",
          fileName
        )
      );
      await HeaderFiles.create({
        id: fileName,
        name: headerFile.name,
        versionChecklistId: id,
      });
    }
    if (commentFile != null) {
      commentFile.mv(
        path.resolve(
          __dirname,
          "..",
          "static/versionChecklist/commentFiles",
          fileName
        )
      );
      await CommentFiles.create({
        id: fileName,
        name: commentFile.name,
        versionChecklistId: id,
      });
    }

    if (theme) {
      theme = JSON.parse(theme);
      theme.forEach((i) =>
        Themes.create({
          title: i.theme,
          versionChecklistId: id,
        })
      );
    }

    const versionChecklistDto = new VersionChecklistDto(versionChecklist);

    return { versionChecklist: versionChecklistDto };
  }

  async getAll(limit, offset, actualKey, title) {

    let versionChecklists;

    if (actualKey && title) {
        versionChecklists = await VersionChecklist.findAndCountAll({
          limit,
          offset,
          where: {
            title: { [Op.iLike]: `%${title}%` },
            actualKey: actualKey
          }
        });
      } else if (actualKey) {
        versionChecklists = await VersionChecklist.findAndCountAll({
          limit,
          offset,
          where: {
            actualKey: actualKey
          }
        });
      } else if (title) {
        versionChecklists = await VersionChecklist.findAndCountAll({
          limit,
          offset,
          where: {
            title: { [Op.iLike]: `%${title}%` },
          }
        });
      } else {
        versionChecklists = await VersionChecklist.findAndCountAll({
          limit,
          offset,
        });
      }


    return versionChecklists;
  }

  async getOne(id) {
    const versionChecklist = await VersionChecklist.findOne({
      where: { id },
      include: [
        { model: Themes, as: "themes" },
        { model: User, as: "user" },
        { model: HeaderFiles },
        { model: CommentFiles },
      ],
    });
    return versionChecklist;
  }

  async deleteOne(id) {

    const nameHeaderFile = await HeaderFiles.findOne({
      where: { versionChecklistId: id },
    });

    const nameCommentFile = await CommentFiles.findOne({
      where: { versionChecklistId: id },
    });

    var fs = require("fs");

    if (nameHeaderFile) {
      fs.unlink(path.resolve(
          __dirname,
          "..",
          "static/versionChecklist/headerFiles",
          nameHeaderFile.id
        ), function(err) {
        if (err) {
          console.log(err);
        }
      });
    }

    if (nameCommentFile) {
      fs.unlink(path.resolve(
          __dirname,
          "..",
          "static/versionChecklist/commentFiles",
          nameCommentFile.id
        ), function(err) {
        if (err) {
          console.log(err);
        }
      });
    }

    await VersionChecklist.destroy({
      where: { id },
    });
  }

  async downloadHeaderFile(headerFile) {
    const file = await HeaderFiles.findOne({
      where: { id: headerFile },
    });

    const pathHeaderFile = path.resolve(
      __dirname,
      "..",
      "static/versionChecklist/headerFiles",
      file.id
    );

    return { pathHeaderFile, file };
  }

  async downloadCommentFile(commentFile) {
    const file = await CommentFiles.findOne({
      where: { id: commentFile },
    });

    const pathCommentFile = path.resolve(
      __dirname,
      "..",
      "static/versionChecklist/commentFiles",
      file.id
    );

    return { pathCommentFile, file };
  }

  async updateOne(
    updateId,
    id,
    actualKey,
    userId,
    quanityType,
    reasonForUse,
    acceptanceDate,
    comment,
    theme,
    title
  ) {
    const candidate = false;

    if (updateId != id) {
      const candidate = await VersionChecklist.findOne({
        where: { id: updateId },
      });
    }

    if (candidate) {
      throw ApiError.BadRequest(
        `Версия чек-листа с номером ${id} уже существует`
      );
    }
    if (actualKey == "Актуально") {
      VersionChecklist.update(
        { actualKey: "Не актуально" },
        { where: { actualKey: "Актуально" } }
      );
    }

    const versionChecklist = await VersionChecklist.update(
      {
        id: updateId,
        actualKey: actualKey,
        userId: userId,
        quanityType: quanityType,
        reasonForUse: reasonForUse,
        acceptanceDate: acceptanceDate,
        comment: comment,
        title: title
      },
      {
        where: { id },
      }
    );

    if (theme) {
      const candidateTheme = await Themes.findOne({
        where: { versionChecklistId: updateId },
      });
      const oldThemes = await Themes.findAll({
        where: { versionChecklistId: updateId },
      });
      const newThemes = JSON.parse(theme);

      if (candidateTheme) {
        oldThemes.forEach((oldItem) => {
          if (newThemes.find((el) => el.id == oldItem.id)) {
            console.log("\n\nСОВПАДЕНИЕ!\n\n", `UPDATE ${oldItem.id}`);
            let updateTitle = newThemes.find((el) => el.id == oldItem.id).title;
            Themes.update(
              {
                title: updateTitle,
                versionChecklistId: updateId,
              },
              {
                where: { id: oldItem.id },
              }
            );
          } else {
            console.log(`\n\nУДАЛЯЕМ ${oldItem.id}\n\n`);
            Themes.destroy({
              where: { id: oldItem.id },
            });
          }
        });
        newThemes.forEach((item) => {
          if (!oldThemes.find((el) => el.id == item.id)) {
            console.log(`\N\NCREATE NEW THEME ${item.id}\n\n`);
            Themes.create({
              title: item.title,
              versionChecklistId: updateId,
            });
          }
        });
      } else {
        newThemes.forEach((i) =>
          Themes.create({
            title: i.title,
            versionChecklistId: updateId,
          })
        );
      }
    }
  }
}

module.exports = new VersionChecklistService();
