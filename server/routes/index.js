const Router = require("express");
const router = new Router();
const userRouter = require("./user-router");
const versionChecklistRouter = require("./versionChecklist-router");
const checklistRouter = require("./checklist-router");

router.use("/versionchecklist", versionChecklistRouter);
router.use("/user", userRouter);
router.use("/checklist", checklistRouter);

module.exports = router;
