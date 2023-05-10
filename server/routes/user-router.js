const Router = require("express");
const router = new Router();

const userController = require("../controllers/user-controller");
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth-middleware");
const checkBlockedMiddleware = require("../middlewares/check-blocked-middleware");

router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 5, max: 32 }),
  userController.registration
);
router.post("/login", checkBlockedMiddleware, userController.login);
router.post("/logout", userController.logout);
router.get("/activate/:link", userController.activate);
router.get("/refresh", userController.refresh);
router.get("/users", authMiddleware, userController.getUsers);
router.get("/auth", authMiddleware, userController.check);
router.delete("/delete/:id", userController.deleteAccount);
router.put("/update/:id", userController.updateAccount);
router.get("/profile-image/:id", userController.getProfileImage);


module.exports = router;
