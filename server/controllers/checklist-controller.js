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

}

module.exports = new ChecklistController();