const Borrower = require("../models/borrower");

const createBorrowerHelper = (userId) => {
  return new Promise((resolve, reject) => {
    Borrower.findOne({ userId })
      .then(async (response) => {
        if (response) {
          resolve(response);
        } else {
          Borrower.create({ userId })
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

module.exports = { createBorrowerHelper };
