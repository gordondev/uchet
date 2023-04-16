module.exports = class VersionChecklistDto {
  id;
  actualKey;
  userId;
  quanityType;
  reasonForUse;
  comment;

  constructor(model) {
    this.id = model.id;
    this.actualKey = model.actualKey;
    this.userId = model.userId;
    this.quanityType = model.quanityType;
    this.reasonForUse = model.reasonForUse;
    this.comment = model.comment;
  }
};
