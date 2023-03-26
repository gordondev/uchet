const Router = require("express");
const router = new Router();
const userRouter = require("./userRouter");
const versionChecklistRouter = require("./versionChecklistRouter");

router.use("/versionchecklist", versionChecklistRouter);
router.use("/user", userRouter);

module.exports = router;
