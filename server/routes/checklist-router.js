const Router = require("express");
const router = new Router();

const checkListController = require("../controllers/checklist-controller");

router.post("/create/", checkListController.create);
router.get("/", checkListController.getAll);
router.get("/:id", checkListController.getOne);
router.delete("/edit/:id", checkListController.deleteOne);
router.put("/edit/:id", checkListController.updateOne);

module.exports = router;
