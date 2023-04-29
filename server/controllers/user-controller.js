const userService = require("../service/user-service");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest(`Ошибка валидации`, errors.array()));
      }
      const { email, password, role, division, name, surname, patronymic } =
        req.body;
      const userData = await userService.registration(
        email,
        password,
        role,
        division,
        name,
        surname,
        patronymic
      );
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async check(req, res, next) {
    try {
      return res.json({ message: "all right" });
    } catch (e) {
      next(e);
    }
  }

  async deleteAccount(req, res, next) {
    try {
      const { id } = req.params;
      await userService.deleteAccount(id);
      return res.json({ message: `Аккаунт был удален` });
    } catch (e) {
      next(e);
    }
  }

  async updateAccount(req, res, next) {
    try {
      const { id } = req.params;
      const { name, surname, patronymic } = req.body;
      console.log(name, surname, patronymic);
      await userService.updateAccount(id, name, surname, patronymic);
      return res.json({ message: `Данные были обновленны` });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
