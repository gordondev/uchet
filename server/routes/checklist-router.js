const Router = require("express");
const router = new Router();

const checkListController = require("../controllers/checklist-controller");

router.post("/create/versionchecklist-id/:id", checkListController.create);
router.get("/", checkListController.getAll);
router.get("/:id", checkListController.getOne);
router.delete("/edit/:id", checkListController.deleteOne);
router.put("/edit/:id", checkListController.updateOne);
router.get("/:id/download", checkListController.downloadFile);

module.exports = router;
