const { createBorrowerHelper } = require("../helpers/borrower");
const Borrower = require("../models/borrower");

/**
 *  Creates a new Borrower or returns existing borrower
 */
exports.createBorrower = async (req, res, next) => {
  try {
    await createBorrowerHelper(req.user._id)
      .then((borrower) => {
        return res.send(borrower);
      })
      .catch((error) => {
        return res
          .status(401)
          .send({ error, message: "Could not create borrower" });
      });
  } catch (error) {
    return res.status(500).json({
      error,
      message: "Unable to create new Borrower",
    });
  }
};

/**
 *  Returns all loans borrower has taken
 */
exports.myLoans = async (req, res, next) => {
  try {
    const borrower = await Borrower.findOne({ userId: req.user._id })
      .select("loans")
      .populate("loans", "-photo -createdAt -updatedAt -__v");

    if (borrower) {
      return res.send(borrower.loans);
    } else {
      return res.send([]);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      message: "Unable to fetch your loans at the moment",
    });
  }
};
