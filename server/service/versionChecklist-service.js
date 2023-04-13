const { VersionChecklist, Themes, User } = require("../models/models");
const VersionChecklistDto = require("../dtos/versionChecklist-dto");
const ApiError = require("../exceptions/api-error");
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
    theme
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

    if (headerFile != null) {
      headerFile.mv(
        path.resolve(
          __dirname,
          "..",
          "static/versionChecklist/headerFiles",
          fileName
        )
      );
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
    }

    const versionChecklist = await VersionChecklist.create({
      id,
      actualKey,
      userId,
      quanityType,
      reasonForUse,
      acceptanceDate,
      comment,
      headerFile: headerFile ? fileName : headerFile,
      commentFile: commentFile ? fileName : commentFile,
    });

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

  async getAll(limit, offset) {
    const versionChecklists = await VersionChecklist.findAndCountAll({ limit, offset });
    return versionChecklists;
  }

  async getOne(id) {
    const versionChecklist = await VersionChecklist.findOne({
      where: { id },
      include: [{model: Themes, as: 'themes'}, {model: User, as: 'user'}],
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
    actualKey,
    userId,
    quanityType,
    reasonForUse,
    acceptanceDate,
    comment,
    theme
  ) {

    console.log("T H E M E S", theme);

    const candidate = false;

    if (updateId != id) {
      const candidate = await VersionChecklist.findOne({ where: { id: updateId } });      
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
        acceptanceDate : acceptanceDate,
        comment: comment,
      },
      {
        where: { id },
      }
    );

    console.log("U P D A T E ID", updateId);

    const candidateTheme = await Themes.findOne({ where: { versionChecklistId: updateId } });

    if (candidateTheme) {
      if (theme) {
        theme = JSON.parse(theme);
        theme.forEach((i) =>
          Themes.update({
            title: i.theme,
            versionChecklistId: updateId,
          },
          {
            where: { id },
          })
        );
      }
    } else if (theme) {
      theme = JSON.parse(theme);
      theme.forEach((i) =>
        Themes.create({
          title: i.theme,
          versionChecklistId: updateId,
        })
      );
    }

  }
}

module.exports = new VersionChecklistService();
