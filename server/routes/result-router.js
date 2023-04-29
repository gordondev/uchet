const Router = require("express");
const router = new Router();

const resultController = require("../controllers/result-controller");

router.get("/actual-themes", resultController.getActualThemes);

module.exports = router;
