const express = require("express");
const { validationResult } = require("express-validator");
const router = express.Router();
// validation
const {
  validLogin,
  validRegister,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../helpers/valid");

//Load Controllers
const { registerController } = require("../controllers/auth.controller.js");
const { activationController } = require("../controllers/activationController");
const { loginController } = require("../controllers/loginController");
const { forgetController } = require("../controllers/forgetController");
const { resetController } = require("../controllers/resetController");
const {
  googleLoginController,
} = require("../controllers/googleLoginController");
const { facebookController } = require("../controllers/facebookController");

// const { validRegister, forgotPasswordValidator } = require("../helpers/valid");

router.post("/register", validRegister, registerController);
router.post("/login", validLogin, loginController);
router.post("/activation", activationController);
router.put("/passwords/forget", forgotPasswordValidator, forgetController);
router.put("/passwords/reset", resetPasswordValidator, resetController);

router.post("/googlelogin", googleLoginController);
router.post("/facebooklogin", facebookController);
module.exports = router;
