const { User, ProfilePhotoFiles } = require("../models/models");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service");
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-error");

const path = require("path");
const mime = require('mime-types')

const fileTypeJPG = "image/jpeg";
const fileTypePNG = "image/png";
const filePath = "static/user/profile-image";

async function saveFile(file, id) {
  let fileId = uuid.v4();
  let fileName;
  if (mime.contentType(file.name) === fileTypeJPG) {
    fileName = fileId + ".jpg";
  } else {
    fileName = fileId + ".png";
  }

  file.mv(path.resolve(__dirname, "..", filePath, fileName));

  await ProfilePhotoFiles.create({
    id: fileId,
    fileName: file.name,
    filePath: filePath,
    fileSize: file.size,
    fileExtension: file.name.split(".").pop(),
    userId: id,
  });
}

async function destroyFile(id) {
  const file = await ProfilePhotoFiles.findOne({
    where: { userId: id },
  });

  var fs = require("fs");

  if (file) {
    await ProfilePhotoFiles.destroy({
      where: { userId: id },
    });
    fs.unlink(
      path.resolve(__dirname, "..", filePath, file.id + "." + file.fileExtension),
      function (err) {
        if (err) {
          console.log(err);
        }
      }
    );
  }
}

function checkFileExtension(file) {
  if (file != null) {
    const fileType = mime.contentType(file.name);
    if (fileType != fileTypeJPG && fileType != fileTypePNG) {
      throw ApiError.BadRequest(
        `${file.name} не является .jpg или .png`
      );
    }
  }
}

class UserService {
  async registration(
    email,
    password,
    role,
    division,
    name,
    surname,
    patronymic
  ) {
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      throw ApiError.BadRequest(
        `Пользователь с почтой ${email} уже существует`
      );
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();

    const user = await User.create({
      email,
      password: hashPassword,
      role,
      activationLink,
      division,
      name,
      surname,
      patronymic,
    });
    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/user/activate/${activationLink}`
    );

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async activate(activationLink) {
    const user = await User.findOne({ where: { activationLink } });
    if (!user) {
      throw ApiError.BadRequest(`Некорректная ссылка активации`);
    }
    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw ApiError.BadRequest("Пользователь с таким email не существует");
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Неверный пароль");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await User.findOne({ where: { id: userData.id } });
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async deleteAccount(id) {
    await User.destroy({
      where: { id },
    });
  }

  async getAllUsers() {
    const users = await User.findAll();
    return users;
  }

  async getProfileImage(id) {
    const image = await ProfilePhotoFiles.findOne({ where: { userId: id } });
    return image;
  }

  async updateAccount(id, name, surname, patronymic, file) {

    checkFileExtension(file);

    const user = await User.update(
      {
        name: name,
        surname: surname,
        patronymic: patronymic,
      },
      {
        where: { id: id },
      }
    );

    if (file != null) {
      const findImage = await ProfilePhotoFiles.findOne({ where: { userId: id } });
      if (findImage) {
        await destroyFile(id);
      }
      await saveFile(file, id);
    }

    return user;
  }
}

module.exports = new UserService();
