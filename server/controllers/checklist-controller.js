const checklist = require("../service/checklist-service");
const ApiError = require("../exceptions/api-error");

class ChecklistController {

	async create(req, res, next) {
    try {
      const { id, name, versionChecklistId, description, file, userId, contents } =
        req.body;

        const checklistData =
        await checklist.createChecklist(
          id,
          name,
          versionChecklistId,
          description,
          file,
          userId,
          contents
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

  async deleteOne(req, res, next) {
    try {
      const { id } = req.params;
      await checklist.deleteOne(id);
      return res.json({ message: `Чек-лист - ${id} удален` });
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }

  async updateOne(req, res, next) {
    try {
      const { id, name, versionChecklistId, description, file, userId, contents } =
        req.body;

      await checklist.updateOne(
        id,
        name,
        versionChecklistId,
        description,
        file,
        userId,
        contents
      );
      return res.json({ message: `Данные чек-листа - ${id} были обновленны` });
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }

}

module.exports = new ChecklistController();