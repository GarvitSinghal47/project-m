const Lender = require("../models/lender");
const Counter = require("../models/counter");

const createLenderHelper = (userId) => {
  return new Promise((resolve, reject) => {
    Lender.findOne({ userId })
      .then(async (response) => {
        if (response) {
          resolve(response);
        } else {
          Lender.create({ userId })
            .then((response) => {
              resolve(response);
            })
            .catch((error) => {
              reject(error);
            });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * Returns the next next unassigned lender ID
 */
const getNextLenderBlockchainId = async () => {
  const allCounters = await Counter.find();
  if (allCounters.length == 0) {
    await Counter.create({
      lastLenderId: 0,
    })
      .then((res) => {
        return res.lastLenderId;
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    allCounters[0].lastLenderId++;
    await allCounters[0].save();
    return allCounters[0].lastLenderId;
  }
};

module.exports = { createLenderHelper, getNextLenderBlockchainId };
