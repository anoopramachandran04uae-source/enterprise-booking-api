const express = require("express");

const { createOrder, listMyOrders } = require("../controllers/orderController");

const { protect } = require("../middlewares/authMiddleware");

const validate = require("../middlewares/validateMiddleware");

const { createOrderValidation } = require("../validations/orderValidation");

const router = express.Router();

router.post("/", protect, validate(createOrderValidation), createOrder);

router.get("/my-orders", protect, listMyOrders);

module.exports = router;
