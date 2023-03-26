const Router = require("express");
const router = new Router();
const userRouter = require("./user-router");
const versionChecklistRouter = require("./versionChecklist-router");

router.use("/versionchecklist", versionChecklistRouter);
router.use("/user", userRouter);

module.exports = router;
