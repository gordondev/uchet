const versionChecklist = require("../service/versionChecklist-service");
const ApiError = require('../exceptions/api-error');

class VersionChecklistController {

    async create(req, res, next) {
        try {
        	// const { id, actual_key, userId, quanity_type, reason_for_use, comment } = req.body;
        } catch (e) {
            next(ApiError.BadRequest(e.message));
        }
    }
    async getAll(req, res) {

    }
    async getOne(req, res) {

    }
}