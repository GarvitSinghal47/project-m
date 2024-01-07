const { createLenderHelper } = require("../helpers/lender");
const Loan = require("../models/loan");
const Lender = require("../models/lender");
const lodash = require("lodash");

/**
 *  Creates a new Lender or returns existing lender
 */
exports.createLender = async (req, res, next) => {
  try {
    await createLenderHelper(req.user._id)
      .then((lender) => {
        return res.send(lender);
      })
      .catch((error) => {
        return res
          .status(401)
          .send({ error, message: "Could not create lender" });
      });
  } catch (error) {
    return res.status(500).json({
      error,
      message: "Unable to create new Lender",
    });
  }
};

/**
 *  Lend amount to an existing loan
 */
exports.lendAmount = async (req, res, next) => {
  try {
    const lender = await createLenderHelper(req.user._id);
    const loan = await Loan.findById(req.body.loanId);

    req.body.amount = parseInt(req.body.amount);
    if (req.body.amount <= 0) {
      return res
        .status(400)
        .send({ message: "Amount lent should be positive" });
    }

    if (loan.amountLeft < req.body.amount) {
      return res.status(400).send({
        message: "You cannot lend more than the remaining amount",
      });
    }

    loan.amountLeft -= req.body.amount;
    req.user.totalAmountLent += req.body.amount;
    //Check if user has already contributed towards this loan
    let existingLender = false;
    for (let i = 0; i < loan.contributors.length; i++) {
      if (loan.contributors[i].userId.equals(req.user._id)) {
        loan.contributors[i].amount += req.body.amount;
        await loan.save();
        existingLender = true;
        break;
      }
    }

    if (existingLender) {
      await req.user.save();
      lender.loans.find(async (loan, i) => {
        if (loan.loanId.equals(req.body.loanId)) {
          lender.loans[i].amount += req.body.amount;
          await lender.save();
          return true;
        }
      });
    } else {
      req.user.numberOfLoansSupported++;
      await req.user.save();
      lender.loans.push({ loanId: loan._id, amount: req.body.amount });
      await lender.save();
      loan.contributors.push({ userId: req.user._id, amount: req.body.amount });
      await loan.save();
    }

    return res.send({
      amountLeft: loan.amountLeft,
      loanContributors: loan.contributors,
      lendersContributions: lender.loans,
      message: "Payment Successful",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      message: "Unable to lend at the moment",
    });
  }
};

/**
 * Returns all the loans that are repaid
 */
exports.repaidLoans = async (req, res, next) => {
  try {
    const lendedLoans = await Lender.findOne({ userId: req.user._id })
      .select("loans -_id")
      .populate({
        path: "loans.loanId",
        match: { repaid: true },
        select: "-photo -createdAt -updatedAt -__v -contributors",
      });

    let repaidLoans = [];
    if (lendedLoans) {
      lendedLoans.loans.forEach((loan) => {
        if (loan.loanId !== null) {
          repaidLoans.push(loan);
        }
      });
    }
    return res.send(repaidLoans);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error,
      message: "Unable to fetch raised loans",
    });
  }
};

/**
 * Returns all the loans that are repaid
 */
exports.fundRaisingInProgress = async (req, res, next) => {
  try {
    const lendedLoans = await Lender.findOne({ userId: req.user._id })
      .select("loans -_id")
      .populate({
        path: "loans.loanId",
        match: { amountLeft: { $gt: 0 } },
        select: "-photo -createdAt -updatedAt -__v -contributors",
      });

    let fundraisingInProgress = [];
    if (lendedLoans) {
      lendedLoans.loans.forEach((loan) => {
        if (loan.loanId !== null) {
          fundraisingInProgress.push(loan);
        }
      });
    }
    return res.send(fundraisingInProgress);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error,
      message: "Unable to fetch raised loans",
    });
  }
};
