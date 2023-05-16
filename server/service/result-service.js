const { VersionChecklist,
 Themes, 
 Checklist, 
 ObservationResults, 
 ThemesResults,
 PointsOfGrowth,
 Strengths,
 ObservationResultsFiles,
 User,
 GradeObservationResults } = require("../models/models");

const ApiError = require("../exceptions/api-error");
const { Op } = require("sequelize");
const mime = require('mime-types')
const path = require("path");
const uuid = require("uuid");

const fileTypePDF = "application/pdf";
const fileTypeJPG = "image/jpeg";
const fileTypeTIFF = "image/tiff";

const filePath = "static/result/reports";

async function getActualId() {
  const actualId = await VersionChecklist.findOne({
    attributes: ['id'],
    where: { actualKey: 'Актуально' },
  });

  return actualId.dataValues.id;
}

function checkFileExtension(file) {
  if (file != null) {
    const fileType = mime.contentType(file.name);
    if (fileType != fileTypePDF && fileType != fileTypeJPG && fileType != fileTypeTIFF) {
      throw ApiError.BadRequest(
        `${file.name} не является .pdf .jpg .tiff`
      );
    }
  }
}

async function createThemes(themes, resultId) {
  await Promise.all(themes.map(async (theme) => {
    const themeResult = await ThemesResults.create({
      themeId: theme.id,
      observationResultId: resultId
    });

  await Promise.all(theme.grades.map(async (checklist) => {
    const gradeResult = await GradeObservationResults.create({
      themesResultId: themeResult.id,
      checklistId: checklist.id,
      grade: checklist.grade
    });
  }));

  await Promise.all(theme.points_of_growths.map(async (point) => {
    const pointResult = await PointsOfGrowth.create({
      themesResultId: themeResult.id,
      point: point.point,
    });
  }));

  await Promise.all(theme.strengths.map(async (strengt) => {
    const strengtResult = await Strengths.create({
      themesResultId: themeResult.id,
      strength: strengt.strengt,
    });
  }));

  }));
}

async function saveFile(file, id) {
  let fileId = uuid.v4();
  let fileName;
  if (mime.contentType(file.name) === fileTypePDF) {
    fileName = fileId + ".pdf";
  } else if (mime.contentType(file.name) === fileTypeJPG) {
    fileName = fileId + ".jpg";
  } else {
    fileName = fileId + ".tiff";
  }

  file.mv(path.resolve(__dirname, "..", filePath, fileName));

  await ObservationResultsFiles.create({
    id: fileId,
    fileName: file.name,
    filePath: filePath,
    fileSize: file.size,
    fileExtension: file.name.split(".").pop(),
    observationResultId: id,
  });
}

class ResultService {

  async updateResultOfChecking(resultOfChecking, rejectionComment, id) {
    const result = await ObservationResults.update(
      {
        resultOfChecking,
        rejectionСomment: rejectionComment,
      },
      {
        where: { id },
      }
    );
    return result;
  }

  async createResult(
    division,
    workInProgress,
    impactOnSave,
    themes,
    file,
    comment,
    finalGrade,
    userId
    ) {

    checkFileExtension(file);

    const result = await ObservationResults.create({
      workInProgress,
      userId,
      division,
      impactOnSave,
      finalGrade,
      comment
    });

    createThemes(themes, result.id);

    if (file != null) {
      saveFile(file, result.id);
    }

  }

  async downloadFile(file) {
    const fileItem = await ObservationResultsFiles.findOne({
      where: { id: file },
    });

    const pathFile = path.resolve(
      __dirname,
      "..",
      filePath,
      fileItem.id + "." + fileItem.fileExtension
    );

    return { pathFile, fileItem };
  }

  async getActualThemes() {
    const actualId = await getActualId();

    const actualThemes = await Themes.findAll({
      attributes: ['title', 'id'],
      where: { versionChecklistId: actualId }
    });

    return actualThemes;
  }

  async getActualChecklists() {

    const actualId = await getActualId();
    const actualChecklists = await Checklist.findAll({
      attributes: ['name', 'id'],
      where: { versionChecklistId: actualId }
    });

    return actualChecklists;
  }

  async getAll(limit, offset, workInProgress, impactOnSave, division, startDate, endDate) {
    const where = {};
    if (workInProgress) where.workInProgress = { [Op.iLike]: `%${workInProgress}%` };
    if (impactOnSave) where.impactOnSave = impactOnSave;
    if (division) where.division = division;
    if (startDate && endDate) where.createdAt = { [Op.between]: [startDate, endDate] };

    const result = await ObservationResults.findAndCountAll({
        limit,
        offset,
        where,
    });
    return result;
}

  async getOne(id) {
    const observationResult = await ObservationResults.findByPk(id, {
      include: [
          { model: ObservationResultsFiles, },
          { model: User, },
        {
          model: ThemesResults,
          include: [
            {
              model: Themes,
            },
            {
              model: GradeObservationResults,
              include: [
                {
                  model: Checklist,
                }
              ]
            },
            {
              model: PointsOfGrowth,
            },
            {
              model: Strengths,
            }
          ]
        }
      ]
    });

    return observationResult;
  }

}
module.exports = new ResultService();
