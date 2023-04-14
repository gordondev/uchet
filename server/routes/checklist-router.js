const Router = require("express");
const router = new Router();

const checkListController = require("../controllers/checklist-controller");

router.post("/create/", checkListController.create);
// router.get("/", versionCheckListController.getAll);
// router.get("/:id", versionCheckListController.getOne);
// router.delete("/edit/:id", versionCheckListController.deleteOne);
// router.put("/edit/:id", versionCheckListController.updateOne);

module.exports = router;
