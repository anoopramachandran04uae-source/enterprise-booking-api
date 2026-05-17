const express = require("express");

const {
  createProduct,
  listProducts,
} = require("../controllers/productController");

const { protect, allowRoles } = require("../middlewares/authMiddleware");

const validate = require("../middlewares/validateMiddleware");

const { createProductValidation } = require("../validations/productValidation");

const router = express.Router();

router.get("/", protect, listProducts);

router.post(
  "/",
  protect,
  allowRoles("admin"),
  validate(createProductValidation),
  createProduct,
);

module.exports = router;
