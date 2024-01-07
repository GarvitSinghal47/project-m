const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { jwtExpiresIn, jwtSecret } = require("../config/keys");
const { getNextLenderBlockchainId } = require("../helpers/lender");

/**
 *  Creates a new User
 */
exports.register = async (req, res, next) => {
  try {
    const { email } = req.body;
    User.findOne({ email })
      .then((user) => {
        if (user) {
          return res.status(400).send({ error: "User already exists" });
        } else {
          bcrypt
            .hash(req.body.password, 8)
            .then(async (hashedPassword) => {
              const newUser = new User({
                fullName: req.body.fullName,
                email: req.body.email,
                password: hashedPassword,
              });
              newUser.lenderBlockchainId = await getNextLenderBlockchainId();

              const token = jwt.sign({ _id: newUser._id }, jwtSecret, {
                expiresIn: jwtExpiresIn,
              });
              newUser.save().then((result) => {
                return res.status(201).json({
                  message: "New User Created",
                  token,
                  user: result,
                });
              });
            })
            .catch((e) => {
              console.log(e);
              return res.status(500).json({
                error: e,
              });
            });
        }
      })
      .catch((e) => {
        console.log(e);
        return res.status(500).json({
          error: "Unable to create new User",
        });
      });
  } catch (error) {
    return res.status(500).json({
      error,
      error: "Unable to create new User",
    });
  }
};

/**
 *  Login User
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return res.status(401).json({
            error: "User email not found.",
          });
        } else {
          bcrypt
            .compare(password, user.password)
            .then((isMatch) => {
              if (!isMatch) {
                return res.status(401).json({
                  error: "User password didn't match.",
                });
              }
              const token = jwt.sign({ _id: user._id }, jwtSecret, {
                expiresIn: jwtExpiresIn,
              });
              return res.status(200).json({
                token: token,
              });
            })
            .catch((e) => {
              console.log(e);
              return res.status(500).json({
                error: e,
              });
            });
        }
      })
      .catch((e) => {
        console.log(e);
        return res.status(500).json({
          error: "Auth failed",
        });
      });
  } catch (error) {
    return res.status(500).json({
      error: "Auth failed",
    });
  }
};
/**
 * Used to add required user details
 */
exports.addUserDetails = async (req, res) => {
  try {
    const schemaProperties = Object.keys(User.schema.paths);
    const requestKeys = Object.keys(req.body);
    const requestValues = Object.values(req.body);
    const updateQuery = {};

    for (let i = 0; i < requestKeys.length; i++) {
      // Only update valid fields according to User Schema
      if (schemaProperties.includes(requestKeys[i])) {
        updateQuery[requestKeys[i]] = requestValues[i];
      }
    }

    User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: updateQuery },
      { new: true },
      (error, updatedObject) => {
        if (error) {
          return res.send({ error, message: "Couldn't add user details" });
        }
        return res.send({
          user: updatedObject,
          message: "Details added successfully",
        });
      }
    );
  } catch (error) {
    res.status(400).send({ error, message: "Couldn't add user details" });
  }
};
/**
 * Searches user by Id
 */
exports.userProfile = async (req, res, next) => {
  try {
    User.findById(req.user._id)
      .then((response) => {
        res.send(response);
      })
      .catch((error) => {
        res.status(401).send({ error, message: "User not found" });
      });
  } catch (error) {
    res.status(500).send({ error, message: "User not found" });
  }
};
