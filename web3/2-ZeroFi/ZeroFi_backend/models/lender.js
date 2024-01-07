const mongoose = require("mongoose");

const lenderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    loans: [
      {
        loanId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Loan",
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
    // cart: [
    //   {
    //     loan: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "Loan",
    //     },
    //     amount: Number,
    //   },
    // ],
  },
  { timestamps: true }
);

const Lender = mongoose.model("Lender", lenderSchema);

module.exports = Lender;
