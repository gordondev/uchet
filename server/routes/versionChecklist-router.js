const Router = require("express");
const router = new Router();

const versionCheckListController = require("../controllers/versionChecklist-controller");

router.post("/create/", versionCheckListController.create);
router.get("/", versionCheckListController.getAll);
router.get("/:id", versionCheckListController.getOne);
router.delete("/edit/:id", versionCheckListController.deleteOne);
router.put("/edit/:id", versionCheckListController.updateOne);
router.get("/:id/download-header", versionCheckListController.downloadHeaderFile);
router.get("/:id/download-comment", versionCheckListController.downloadCommentFile);

module.exports = router;
