module.exports = class UserDto {
	email;
	id;
	isActivated;
	division;
	fullname;

	constructor(model) {
		this.email = model.email;
		this.id = model.id;
		this.isActivated = model.isActivated;
		this.division = model.division;
		this.fullname = model.fullname;
	}
}