const checklist = require("../service/checklist-service");
const ApiError = require("../exceptions/api-error");

class ChecklistController {
  async create(req, res, next) {
    try {
      const { themeId, versionChecklistId, description, userId, contents } =
        req.body;

      const file = req.files?.file || null;

      const checklistData = await checklist.createChecklist(
        themeId,
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
      let { limit, page, versionChecklistId, title } = req.query;
      page = page || 1;
      limit = limit || 16;
      let offset = page * limit - limit;
      const checklistData = await checklist.getAll(
        limit,
        offset,
        versionChecklistId,
        title
      );

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

  async downloadFile(req, res, next) {
    try {
      const { file } = req.query;

      const path = await checklist.downloadFile(file);

      return res.download(path.pathFile, path.fileItem.id);
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }

  async updateOne(req, res, next) {
    try {
      const {
        id,
        themeId,
        versionChecklistId,
        description,
        contents,
        fileIsDeleted,
      } = req.body;

      if (!req.files) {
        const checklistData = await checklist.updateOne(
          id,
          themeId,
          versionChecklistId,
          description,
          contents,
          null,
          fileIsDeleted
        );
        return res.json(checklistData);
      } else {
        const { file } = req.files;
        const checklistData = await checklist.updateOne(
          id,
          themeId,
          versionChecklistId,
          description,
          contents,
          file,
          fileIsDeleted
        );
        return res.json(checklistData);
      }

      return res.json({ message: `Данные чек-листа - ${id} были обновленны` });
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }
}

module.exports = new ChecklistController();
