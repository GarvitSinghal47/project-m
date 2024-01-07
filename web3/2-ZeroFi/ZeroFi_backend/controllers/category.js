const Category = require("../models/category");

exports.createCategory = async (req, res, next) => {
  try {
    const category = new Category(req.body);
    await category.save();
    return res.send(category);
  } catch (error) {
    return res.send({ error, message: "Could not create category" });
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().select(
      "-createdAt -updatedAt -__v"
    );
    return res.send(categories);
  } catch (error) {
    return res.send({ error, message: "Could not get categories" });
  }
};
