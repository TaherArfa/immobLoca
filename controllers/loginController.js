const jwt = require("jsonwebtoken");
const { errorHandler } = require("../helpers/dbErrorHandling");
const User = require("../models/auth.model");
const { validationResult } = require("express-validator");

exports.loginController = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  // validation to req,body we will create custon validation
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    // check if user exist
    User.findOne({
      email,
    }).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          errors: "User with that email does not exist. Please signup",
        });
      }
      // authenticate
      if (!user.authenticate(password)) {
        return res.status(400).json({
          errors: "Email and password do not match",
        });
      }
      // generate a token and send to client
      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d", // Token valid in 7day you can set rember me in front and set it for 30day
        }
      );
      const { _id, name, email, role } = user;

      return res.json({
        token,
        user: {
          _id,
          name,
          email,
          role,
        },
        message: "Sign in success",
      });
    });
  }
};
