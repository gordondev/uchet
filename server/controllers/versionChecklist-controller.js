const versionChecklist = require("../service/versionChecklist-service");
const ApiError = require("../exceptions/api-error");

class VersionChecklistController {
  async create(req, res, next) {
    try {
      const { id, actual_key, userId, quanity_type, reason_for_use, comment, themes } =
        req.body;

      const { header_file } = req.files;
      const { comment_file } = req.files;

      const versionChecklistData =
        await versionChecklist.createVersionChecklist(
          id,
          actual_key,
          userId,
          quanity_type,
          reason_for_use,
          comment,
          header_file,
          comment_file,
          themes
        );

      return res.json(versionChecklistData);
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }
  async getAll(req, res) {
    try {
      const versionChecklistsData = await versionChecklist.getAll();
      return res.json(versionChecklistsData);
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }
  async getOne(req, res) {
    try {
      const { id } = req.params;
      const versionChecklistData = await versionChecklist.getOne(id);
      return res.json(versionChecklistData);
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }
  async deleteOne(req, res) {
    try {
      const { id } = req.params;
      await versionChecklist.deleteOne(id);
      return res.json({ message: `Версия чек-листа - ${id} удалена` });
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }
  async updateOne(req, res) {
    try {
      const { updateId, id, actual_key, userId, quanity_type, reason_for_use, comment } =
        req.body;

      await versionChecklist.updateOne(
        updateId,
        id,
        actual_key,
        userId,
        quanity_type,
        reason_for_use,
        comment
      );
      return res.json({ message: `Данные чек-листа - ${id} были обновленны` });
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }
}

module.exports = new VersionChecklistController();
