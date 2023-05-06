const Router = require("express");
const router = new Router();

const resultController = require("../controllers/result-controller");

router.get("/actual-themes", resultController.getActualThemes);
router.get("/actual-checklists", resultController.getActualChecklists);
router.post("/create", resultController.create);

module.exports = router;
