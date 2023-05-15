const result = require("../service/result-service");
const ApiError = require("../exceptions/api-error");

class ResultController {
  async getActualThemes(req, res, next) {
    try {
      const resultData = await result.getActualThemes();
      return res.json(resultData);
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }
  async getActualChecklists(req, res, next) {
    try {
      const resultData = await result.getActualChecklists();
      return res.json(resultData);
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      let { limit, page, workInProgress, impactOnSave, division, startDate, endDate } = req.query;
      page = page || 1;
      limit = limit || 16;
      let offset = page * limit - limit;

      if (isNaN(limit) || isNaN(page) || limit <= 0 || page <= 0) {
        throw new Error('Invalid limit or page');
      }

      const resultData = await result.getAll(
        limit, offset, workInProgress, impactOnSave, division, startDate, endDate
      );

      return res.json(resultData);
    } catch (e) {
      if (e.message === 'Invalid limit or page') {
        return next(ApiError.BadRequest(e.message));
      }
      next(e);
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const resultData = await result.getOne(id);
      return res.json(resultData);
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }

  async downloadFile(req, res, next) {
    try {
      const { file } = req.query;

      console.log(req.query);

      const path = await result.downloadFile(file);

      return res.download(path.pathFile, path.fileItem.id);
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }

  async updateResultOfChecking(req, res, next) {
    try {
      const { resultOfChecking, rejectionComment, id } = req.body;
      const resultOfCheckingData = await result.updateResultOfChecking(resultOfChecking, rejectionComment, id);
      return res.json(resultOfCheckingData);
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }

  async create(req, res, next) {
    try {
      const { workInProgress, impactOnSave, themes, comment, finalGrade, division, userId } =
        req.body;

      const file = req.files?.file || null;

      const resultData = await result.createResult(
        division,
        workInProgress,
        impactOnSave,
        JSON.parse(themes),
        file,
        comment,
        finalGrade,
        userId
      );

      return res.json(resultData);
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }
}

module.exports = new ResultController();
