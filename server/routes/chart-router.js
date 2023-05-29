

const Router = require("express");
const router = new Router();

const chartController = require("../controllers/chart-controller");

router.get("/", chartController.getAllCountResults);

module.exports = router;
