const { OAuth2Client } = require("google-auth-library");
const User = require("../models/auth.model");
const _ = require("lodash");
const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");
// Custom error handler to get usefull error from database errors
const { errorHandler } = require("../helpers/dbErrorHandling");
// sendgrid to send email
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.MAIL_KEY);

const client = new OAuth2Client(process.env.GOOGLE_CLIENT);
// Google Login
exports.googleLoginController = (req, res) => {
  const { idToken } = req.body;
  // get token from request
  //verify token
  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT })
    .then((response) => {
      // console.log('GOOGLE LOGIN RESPONSE',response)
      const { email_verified, name, email } = response.payload;
      //check if email verified
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          // find if this email already exists
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const { _id, email, name, role } = user;
            //send response to cliend side (react ) token and user info
            return res.json({
              token,
              user: { _id, email, name, role },
            });
          } else {
            // if user not exists we will save in database and generate password for it
            let password = email + process.env.JWT_SECRET;
            user = new User({ name, email, password });
            // create user object with this email
            user.save((err, data) => {
              if (err) {
                console.log("ERROR GOOGLE LOGIN ON USER SAVE", err);
                return res.status(400).json({
                  //   error: "User signup failed with google",
                  error: errorHandler(err, "User signup failed with google"),
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
              );
              const { _id, email, name, role } = data;
              return res.json({
                token,
                user: { _id, email, name, role },
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          error: "Google login failed. Try again",
        });
      }
    });
};
