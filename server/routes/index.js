const Router = require("express");
const router = new Router();
const userRouter = require("./user-router");
const versionChecklistRouter = require("./versionChecklist-router");
const checklistRouter = require("./checklist-router");
const resultRouter = require("./result-router");

router.use("/versionchecklist", versionChecklistRouter);
router.use("/user", userRouter);
router.use("/checklist", checklistRouter);
router.use("/result", resultRouter);

module.exports = router;
