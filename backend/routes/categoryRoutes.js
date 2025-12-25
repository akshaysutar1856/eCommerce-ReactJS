const express = require("express");
const {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/categoryController");

const router = express.Router();

router.route("/").get(getCategories).post(createCategory);
router.route("/:id").delete(deleteCategory).put(updateCategory);

module.exports = router;
