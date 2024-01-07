const mongoose = require("mongoose");

/**
 * This model is just used to create auto incrementing lender blockchain Id's
 */
const counterSchema = new mongoose.Schema(
  {
    lastLenderId: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Counter = mongoose.model("Counter", counterSchema);

module.exports = Counter;
