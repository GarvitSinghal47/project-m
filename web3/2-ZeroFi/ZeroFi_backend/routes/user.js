const router = require("express").Router(); // get an instance of the express Router
const controller = require("../controllers/user");
const asyncHandler = require("express-async-handler");
const { authRequired } = require("../middleware/auth");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/profile", authRequired, asyncHandler(controller.userProfile));
router.post(
  "/userDetails",
  authRequired,
  asyncHandler(controller.addUserDetails)
);

module.exports = router;
