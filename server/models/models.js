const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING(500) },
  role: { type: DataTypes.STRING, defaultValue: "USER" },
  division: { type: DataTypes.ENUM('ТЦ-3', 'РЦ-2', 'РЦ-3', 'ЦЦР', 'ЦОРО', 'ЭЦ', 'ЦТАИ', 'ЦВ', 'ОРБ', 'ХЦ', 'ТЦ-2', 'РТЦ-1', 'ЦОС', 'ОПБ', 'ОЯБиН', 'Управление', 'ОТИиПБ', 'ОИиКОБ', 'ООТ', 'УТП') },
  name: { type: DataTypes.STRING(600) },
  surname: { type: DataTypes.STRING(600) },
  patronymic: { type: DataTypes.STRING(600) },
  isActivated: {type: DataTypes.BOOLEAN, defaultValue: false},
  activationLink: { type: DataTypes.STRING(500) },
});

const Tokens = sequelize.define("tokens", {
  userId: { type: DataTypes.INTEGER },
  refreshToken: { type: DataTypes.STRING(600), required: true },
});

const VersionChecklist = sequelize.define("version_checklist", {
  id: { type: DataTypes.INTEGER, primaryKey: true, unique: true },
  actual_key: { type: DataTypes.ENUM('Актуально', 'Не актуально') },
  userId: { type: DataTypes.INTEGER },
  header_file: { type: DataTypes.STRING(500) },
  comment_file: { type: DataTypes.STRING(500) },
  quanity_type: { type: DataTypes.INTEGER },
  acceptance_date: { type: 'TIMESTAMP' },
  reason_for_use: { type: DataTypes.STRING(500) },
  comment: { type: DataTypes.STRING(500) },
});

const Checklist = sequelize.define("checklist", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  versionChecklistId: { type: DataTypes.INTEGER },
  description: { type: DataTypes.STRING(500) },
  file: { type: DataTypes.STRING(500) },
  userId: { type: DataTypes.INTEGER },
});

const ChecklistContent = sequelize.define("checklist_content", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  content: { type: DataTypes.STRING(500) },
  checklistId: { type: DataTypes.INTEGER },
});

const ObservationResults = sequelize.define("observation_results", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER },
  division: { type: DataTypes.STRING },
  impact_on_save: { type: DataTypes.ENUM('Нет', 'Да') },
  final_grade: { type: DataTypes.ENUM('Ниже требований', 'Соответствуют требованиям', 'Выше требований') },
  file: { type: DataTypes.STRING(500) },
  comment: { type: DataTypes.STRING(500) },
});

const Themes = sequelize.define("themes", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING },
  versionChecklistId: { type: DataTypes.INTEGER },
  observationResultId: { type: DataTypes.INTEGER },
});

const Strengths = sequelize.define("strengths", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  themeId: { type: DataTypes.INTEGER },
  strength: { type: DataTypes.STRING(500) },
});

const PointsOfGrowth = sequelize.define("pointsOfGrowth", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  themeId: { type: DataTypes.INTEGER },
  point: { type: DataTypes.STRING(500) },
});

const GradeObservationResults = sequelize.define("gradeObservationResults", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  themeId: { type: DataTypes.INTEGER },
  checklistId: { type: DataTypes.INTEGER },
  grade: { type: DataTypes.ENUM('Ниже требований', 'Соответствуют требованиям', 'Выше требований', 'Не наблюдалось') },
});

User.hasMany(Tokens);
Tokens.belongsTo(User);

User.hasMany(VersionChecklist);
VersionChecklist.belongsTo(User);

User.hasMany(Checklist);
Checklist.belongsTo(User);

VersionChecklist.hasMany(Checklist);
Checklist.belongsTo(VersionChecklist);

Checklist.hasMany(ChecklistContent);
ChecklistContent.belongsTo(Checklist);

User.hasMany(ObservationResults);
ObservationResults.belongsTo(User);

ObservationResults.hasMany(Themes);
Themes.belongsTo(ObservationResults);

VersionChecklist.hasMany(Themes);
Themes.belongsTo(VersionChecklist);

Themes.hasMany(Strengths);
Strengths.belongsTo(Themes);

Themes.hasMany(PointsOfGrowth);
PointsOfGrowth.belongsTo(Themes);

Themes.hasMany(GradeObservationResults);
GradeObservationResults.belongsTo(Themes);

Checklist.hasMany(GradeObservationResults);
GradeObservationResults.belongsTo(Checklist);

module.exports = {
  User,
  Tokens,
  VersionChecklist,
  Checklist,
  ChecklistContent,
  ObservationResults,
  Themes,
  Strengths,
  PointsOfGrowth,
  GradeObservationResults,
};
