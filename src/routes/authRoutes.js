const express = require("express");

const {
  register,
  login,
  refreshToken,
  logout,
  profile,
} = require("../controllers/authController");

const validate = require("../middlewares/validateMiddleware");

const {
  registerValidation,
  loginValidation,
} = require("../validations/authValidation");

const { protect } = require("../middlewares/authMiddleware");

const { authLimiter } = require("../middlewares/rateLimitMiddleware");

const router = express.Router();

router.post("/register", authLimiter, validate(registerValidation), register);

router.post("/login", authLimiter, validate(loginValidation), login);

router.post("/refresh-token", refreshToken);

router.post("/logout", logout);

router.get("/profile", protect, profile);

module.exports = router;
