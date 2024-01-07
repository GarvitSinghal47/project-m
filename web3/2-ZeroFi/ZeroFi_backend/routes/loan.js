const router = require("express").Router();
const loanController = require("../controllers/loan");
const asyncHandler = require("express-async-handler");
const { authRequired } = require("../middleware/auth");
const { upload } = require("../middleware/multer");

router.post(
  "/create",
  authRequired,
  upload.single("photo"),
  asyncHandler(loanController.createLoan)
);
router.get(
  "/activeLoans/:category",
  loanController.displayActiveLoansWithFilter
);
router.get("/activeLoans/", loanController.displayActiveLoans);
router.get("/loanPhoto/:loanId", loanController.getLoanPhoto);
router.get("/reqLoan/:loanId", loanController.getLoanById);

module.exports = router;
