const checklist = require("../service/checklist-service");
const ApiError = require("../exceptions/api-error");

class ChecklistController {

	async create(req, res, next) {
    try {
      const { id, name, versionChecklistId, description, file, userId } =
        req.body;

        const checklistData =
        await checklist.createChecklist(
          id,
          name,
          versionChecklistId,
          description,
          file,
          userId
        );
        return res.json(checklistData);
        
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      let {limit, page} = req.query;
      page = page || 1;
      limit = limit || 24;
      let offset = page * limit - limit;
      const checklistData = await checklist.getAll(limit, offset);
      return res.json(checklistData);
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const checklistData = await checklist.getOne(id);
      return res.json(checklistData);
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }

}

module.exports = new ChecklistController();