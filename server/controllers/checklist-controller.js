const checklist = require("../service/checklist-service");
const ApiError = require("../exceptions/api-error");

class ChecklistController {
  async create(req, res, next) {
    try {
      const { name, versionChecklistId, description, userId, contents } =
        req.body;

      if (!req.files) {
        const checklistData = await checklist.createChecklist(
          name,
          versionChecklistId,
          description,
          null,
          userId,
          contents
        );
        return res.json(checklistData);
      } else {
        const { file } = req.files;
        const checklistData = await checklist.createChecklist(
          name,
          versionChecklistId,
          description,
          file,
          userId,
          contents
        );
        return res.json(checklistData);
      }
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      let { limit, page, versionChecklistId, name } = req.query;
      page = page || 1;
      limit = limit || 16;
      let offset = page * limit - limit;
      const checklistData = await checklist.getAll(limit, offset, versionChecklistId, name );

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
      const { id, name, versionChecklistId, description, contents } = req.body;

      console.log(
        "DATA\n\n",
        id,
        name,
        versionChecklistId,
        description,
        contents
      );

      await checklist.updateOne(
        id,
        name,
        versionChecklistId,
        description,
        contents
      );
      return res.json({ message: `Данные чек-листа - ${id} были обновленны` });
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }
}

module.exports = new ChecklistController();
