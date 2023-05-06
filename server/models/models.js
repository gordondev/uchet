const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING(600) },
  role: { type: DataTypes.STRING, defaultValue: "USER" },
  division: {
    type: DataTypes.ENUM(
      "ТЦ-3",
      "РЦ-2",
      "РЦ-3",
      "ЦЦР",
      "ЦОРО",
      "ЭЦ",
      "ЦТАИ",
      "ЦВ",
      "ОРБ",
      "ХЦ",
      "ТЦ-2",
      "РТЦ-1",
      "ЦОС",
      "ОПБ",
      "ОЯБиН",
      "Управление",
      "ОТИиПБ",
      "ОИиКОБ",
      "ООТ",
      "УТП"
    ),
  },
  name: { type: DataTypes.STRING(600) },
  surname: { type: DataTypes.STRING(600) },
  patronymic: { type: DataTypes.STRING(600) },
  isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
  isBlocked: { type: DataTypes.BOOLEAN, defaultValue: false },
  activationLink: { type: DataTypes.STRING(600) },
});

const ProfilePhotoFiles = sequelize.define("profile_photo_files", {
  id: { type: DataTypes.STRING(600), primaryKey: true, unique: true },
  fileName: { type: DataTypes.STRING(600) },
  filePath: { type: DataTypes.STRING(600) },
  fileSize: { type: DataTypes.STRING(600) },
  fileExtension: { type: DataTypes.STRING(600) },
  userId: { type: DataTypes.INTEGER },
});

const Tokens = sequelize.define("tokens", {
  userId: { type: DataTypes.INTEGER },
  refreshToken: { type: DataTypes.STRING(600), required: true },
});

const VersionChecklist = sequelize.define("version_checklist", {
  id: { type: DataTypes.INTEGER, primaryKey: true, unique: true },
  actualKey: { type: DataTypes.ENUM("Актуально", "Не актуально") },
  title: { type: DataTypes.STRING(600) },
  userId: { type: DataTypes.INTEGER },
  quanityType: { type: DataTypes.INTEGER },
  acceptanceDate: { type: DataTypes.DATEONLY },
  reasonForUse: { type: DataTypes.STRING(500) },
  comment: { type: DataTypes.STRING(500) },
});

const HeaderFiles = sequelize.define("header_files", {
  id: { type: DataTypes.STRING(600), primaryKey: true, unique: true },
  fileName: { type: DataTypes.STRING(600) },
  filePath: { type: DataTypes.STRING(600) },
  fileSize: { type: DataTypes.STRING(600) },
  fileExtension: { type: DataTypes.STRING(600) },
  versionChecklistId: { type: DataTypes.INTEGER },
});

const CommentFiles = sequelize.define("comment_files", {
  id: { type: DataTypes.STRING(600), primaryKey: true, unique: true },
  fileName: { type: DataTypes.STRING(600) },
  filePath: { type: DataTypes.STRING(600) },
  fileSize: { type: DataTypes.STRING(600) },
  fileExtension: { type: DataTypes.STRING(600) },
  versionChecklistId: { type: DataTypes.INTEGER },
});

const Checklist = sequelize.define("checklist", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  versionChecklistId: { type: DataTypes.INTEGER },
  description: { type: DataTypes.STRING(600) },
  userId: { type: DataTypes.INTEGER },
});

const ChecklistFiles = sequelize.define("checklist_files", {
  id: { type: DataTypes.STRING(600), primaryKey: true, unique: true },
  fileName: { type: DataTypes.STRING(600) },
  filePath: { type: DataTypes.STRING(600) },
  fileSize: { type: DataTypes.STRING(600) },
  fileExtension: { type: DataTypes.STRING(600) },
  checklistId: { type: DataTypes.INTEGER },
});

const ChecklistContent = sequelize.define("checklist_content", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  content: { type: DataTypes.STRING(600) },
  checklistId: { type: DataTypes.INTEGER },
});

const ObservationResults = sequelize.define("observation_results", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  workInProgress: { type: DataTypes.STRING(600) },
  userId: { type: DataTypes.INTEGER },
  division: { type: DataTypes.STRING },
  impactOnSave: { type: DataTypes.ENUM("Нет", "Да") },
  resultOfChecking: { type: DataTypes.ENUM("Не принято", "Принято") },
  finalGrade: {
    type: DataTypes.ENUM(
      "Ниже требований",
      "Соответствуют требованиям",
      "Выше требований"
    ),
  },
  rejectionСomment: { type: DataTypes.STRING(600) },
  comment: { type: DataTypes.STRING(600) },
});

const ObservationResultsFiles = sequelize.define("observation_results_files", {
  id: { type: DataTypes.STRING(600), primaryKey: true, unique: true },
  fileName: { type: DataTypes.STRING(600) },
  filePath: { type: DataTypes.STRING(600) },
  fileSize: { type: DataTypes.STRING(600) },
  fileExtension: { type: DataTypes.STRING(600) },
  observationResultId: { type: DataTypes.INTEGER },
});

const Themes = sequelize.define("themes", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING },
  versionChecklistId: { type: DataTypes.INTEGER },
});

const ThemesResults = sequelize.define("themes_results", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  themeId: { type: DataTypes.INTEGER },
  observationResultId: { type: DataTypes.INTEGER },
});

const Strengths = sequelize.define("strengths", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  themesResultId: { type: DataTypes.INTEGER },
  strength: { type: DataTypes.STRING(600) },
});

const PointsOfGrowth = sequelize.define("points_of_growth", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  themesResultId: { type: DataTypes.INTEGER },
  point: { type: DataTypes.STRING(600) },
});

const GradeObservationResults = sequelize.define("grade_observation_results", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  themesResultId: { type: DataTypes.INTEGER },
  checklistId: { type: DataTypes.INTEGER },
  grade: {
    type: DataTypes.ENUM(
      "Ниже требований",
      "Соответствуют требованиям",
      "Выше требований",
      "Не наблюдалось"
    ),
  },
});

User.hasMany(Tokens);
Tokens.belongsTo(User);

User.hasMany(VersionChecklist);
VersionChecklist.belongsTo(User);

User.hasMany(Checklist);
Checklist.belongsTo(User);

User.hasMany(ProfilePhotoFiles);
ProfilePhotoFiles.belongsTo(User);

VersionChecklist.hasMany(Checklist);
Checklist.belongsTo(VersionChecklist);

VersionChecklist.hasMany(HeaderFiles);
HeaderFiles.belongsTo(VersionChecklist);

VersionChecklist.hasMany(CommentFiles);
CommentFiles.belongsTo(VersionChecklist);

Checklist.hasMany(ChecklistContent);
ChecklistContent.belongsTo(Checklist);

Checklist.hasMany(ChecklistFiles);
ChecklistFiles.belongsTo(Checklist);

User.hasMany(ObservationResults);
ObservationResults.belongsTo(User);

ObservationResults.hasMany(ThemesResults);
ThemesResults.belongsTo(ObservationResults);

Themes.hasMany(ThemesResults);
ThemesResults.belongsTo(Themes);

ObservationResults.hasMany(ObservationResultsFiles);
ObservationResultsFiles.belongsTo(ObservationResults);

VersionChecklist.hasMany(Themes);
Themes.belongsTo(VersionChecklist);

ThemesResults.hasMany(Strengths);
Strengths.belongsTo(ThemesResults);

ThemesResults.hasMany(PointsOfGrowth);
PointsOfGrowth.belongsTo(ThemesResults);

ThemesResults.hasMany(GradeObservationResults);
GradeObservationResults.belongsTo(ThemesResults);

Checklist.hasMany(GradeObservationResults);
GradeObservationResults.belongsTo(Checklist);

module.exports = {
  User,
  Tokens,
  VersionChecklist,
  HeaderFiles,
  CommentFiles,
  ProfilePhotoFiles,
  Checklist,
  ChecklistFiles,
  ChecklistContent,
  ObservationResults,
  ObservationResultsFiles,
  Themes,
  Strengths,
  PointsOfGrowth,
  GradeObservationResults,
  ThemesResults,
};
