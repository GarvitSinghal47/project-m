const router = require("express").Router(); // get an instance of the express Router
const controller = require("../controllers/category");
const asyncHandler = require("express-async-handler");

router.post("/create", asyncHandler(controller.createCategory));
router.get("/getCategories", asyncHandler(controller.getCategories));

module.exports = router;
