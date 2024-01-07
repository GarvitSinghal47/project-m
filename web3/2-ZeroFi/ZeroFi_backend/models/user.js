const mongoose = require("mongoose");
const { Schema } = mongoose;

var userSchema = new Schema(
  {
    fullName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    zipcode: {
      type: Number,
    },
    bio: {
      type: String,
    },
    income: {
      type: Number,
    },
    occupation: {
      type: String,
    },
    idNumber: {
      type: String,
    },
    idDoc: {
      type: String,
    },
    walletId: {
      type: String,
    },
    lenderBlockchainId: {
      type: String,
      required: true,
    },
    totalAmountLent: {
      type: Number,
      required: true,
      default: 0,
    },
    totalAmountBorrowed: {
      type: Number,
      required: true,
      default: 0,
    },
    numberOfLoansApplied: {
      type: Number,
      required: true,
      default: 0,
    },
    numberOfLoansSupported: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
