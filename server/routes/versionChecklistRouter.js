const Router = require("express");
const router = new Router();

const versionCheckListController = require("../controllers/versionChecklist-controller");

router.post("/", versionCheckListController.create);
router.get("/", versionCheckListController.getAll);
router.get("/:id", versionCheckListController.getOne);
router.delete("/:id", versionCheckListController.deleteOne);

module.exports = router;
