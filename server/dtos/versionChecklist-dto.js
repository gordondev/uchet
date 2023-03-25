module.exports = class VersionChecklistDto {
	id;
	actual_key;
	userId;
	quanity_type;
	reason_for_use;
	comment;

	constructor(model) {
		this.id = model.id;
		this.actual_key = model.actual_key;
		this.userId = model.userId;
		this.quanity_type = model.quanity_type;
		this.reason_for_use = model.reason_for_use;
		this.comment = model.comment;
	}
}