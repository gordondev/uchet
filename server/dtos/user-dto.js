module.exports = class UserDto {
  email;
  id;
  isActivated;
  division;
  name;
  surname;
  patronymic;
  isBlocked;

  constructor(model) {
    this.email = model.email;
    this.id = model.id;
    this.isActivated = model.isActivated;
    this.division = model.division;
    this.name = model.name;
    this.surname = model.surname;
    this.patronymic = model.patronymic;
    this.isBlocked = model.isBlocked;
  }
};
