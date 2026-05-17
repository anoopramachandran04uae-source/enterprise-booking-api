const express = require("express");

const { list } = require("../controllers/userController");

const { protect, allowRoles } = require("../middlewares/authMiddleware");
const { authLimiter } = require("../middlewares/rateLimitMiddleware");

const router = express.Router();

router.get("/list", authLimiter, protect, allowRoles("admin"), list);

module.exports = router;
