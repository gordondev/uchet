module.exports = class ChecklistDto {
    id;
    name;
    versionChecklistId;
    description;
    userId;

	constructor(model) {
		this.id = model.id;
    	this.name = model.name;
    	this.versionChecklistId = model.versionChecklistId;
    	this.description = model.description;
    	this.userId = model.userId;
	}
}