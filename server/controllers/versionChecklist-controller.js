const versionChecklist = require("../service/versionChecklist-service");
const ApiError = require("../exceptions/api-error");

class VersionChecklistController {

  async uploadFile(req, res, next) {
    try {
      let file = req.files.file;
      return res.json("access");
    } catch(e) {
      next(ApiError.BadRequest(e.message));
    }
  }

  async create(req, res, next) {
    try {
      const { id, actualKey, userId, quanityType, reasonForUse, acceptanceDate, comment, theme } =
        req.body;

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
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }
  async getAll(req, res, next) {
    try {
      const versionChecklistsData = await versionChecklist.getAll();
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
      const { updateId, id, actualKey, userId, quanityType, reasonForUse, comment } =
        req.body;

      await versionChecklist.updateOne(
        updateId,
        id,
        actualKey,
        userId,
        quanityType,
        reasonForUse,
        comment
      );
      return res.json({ message: `Данные чек-листа - ${id} были обновленны` });
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }
}

module.exports = new VersionChecklistController();
