const versionChecklist = require("../service/versionChecklist-service");
const ApiError = require("../exceptions/api-error");

class VersionChecklistController {
  async create(req, res, next) {
    try {
      const {
        id,
        actualKey,
        userId,
        quanityType,
        reasonForUse,
        acceptanceDate,
        comment,
        theme,
      } = req.body;

      if (!req.files) {
        const versionChecklistData =
          await versionChecklist.createVersionChecklist(
            id,
            actualKey,
            userId,
            quanityType,
            reasonForUse,
            acceptanceDate,
            comment,
            null,
            null,
            theme
          );
        return res.json(versionChecklistData);
      } else {
        const { headerFile } = req.files;
        const { commentFile } = req.files;

        const versionChecklistData =
          await versionChecklist.createVersionChecklist(
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
          );
        return res.json(versionChecklistData);
      }
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      let { limit, page } = req.query;
      page = page || 1;
      limit = limit || 24;
      let offset = page * limit - limit;
      const versionChecklistsData = await versionChecklist.getAll(
        limit,
        offset
      );
      return res.json(versionChecklistsData);
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const versionChecklistData = await versionChecklist.getOne(id);
      return res.json(versionChecklistData);
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }

  async deleteOne(req, res, next) {
    try {
      const { id } = req.params;
      await versionChecklist.deleteOne(id);
      return res.json({ message: `Версия чек-листа - ${id} удалена` });
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }

  async updateOne(req, res, next) {
    try {
      const {
        updateId,
        id,
        actualKey,
        userId,
        quanityType,
        reasonForUse,
        acceptanceDate,
        comment,
        theme,
      } = req.body;

      await versionChecklist.updateOne(
        updateId,
        id,
        actualKey,
        userId,
        quanityType,
        reasonForUse,
        acceptanceDate,
        comment,
        theme
      );
      return res.json({ message: `Данные чек-листа - ${id} были обновленны` });
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }
}

module.exports = new VersionChecklistController();
