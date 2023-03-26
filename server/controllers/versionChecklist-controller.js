const versionChecklist = require("../service/versionChecklist-service");
const ApiError = require("../exceptions/api-error");

class VersionChecklistController {
  async create(req, res, next) {
    try {
      const { id, actual_key, userId, quanity_type, reason_for_use, comment } =
        req.body;

      const versionChecklistData =
        await versionChecklist.createVersionChecklist(
          id,
          actual_key,
          userId,
          quanity_type,
          reason_for_use,
          comment
        );
      return res.json(versionChecklistData);
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }
  async getAll(req, res) {
    try {
      const versionChecklists = await versionChecklist.getAll();
      return res.json(versionChecklists);
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }
  async getOne(req, res) {
    try {
      const { id } = req.params;
      versionChecklist = await versionChecklist.getOne(id);
      return res.json(versionChecklist);
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }
}

module.exports = new VersionChecklistController();
