const User = require("../models/auth.model");
const expressJwt = require("express-jwt");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
// Custom error handler to get usefull error from database errors
const { errorHandler } = require("../helpers/dbErrorHandling");
// sendgrid to send email
const sgMail = require("@sendgrid/mail");
const e = require("express");
sgMail.setApiKey(process.env.MAIL_KEY);

exports.registerController = (req, res) => {
  const { name, email, password } = req.body;
  //   console.log(name, email, password);
  const errors = validationResult(req);

  //validation to req,body
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({ error: firstError });
  } else {
    User.findOne({ email }).exec((err, user) => {
      // if user exists
      if (user) {
        return res.status(400).json({
          error: "EMail is taken",
        });
      }
    });

    // generate Token
    const token = jwt.sign(
      {
        name,
        email,
        password,
      },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        // expiresIn: "15m",
        expiresIn: "360m",
      }
    );

    // creation du corps du mail
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Account Activation link",
      html: `
            <h1> Please Click to link to activate</h1>
            <p> ${process.env.CLIENT_URL}/users/activate/${token}</p>
            </hr>
            <p>This Email Contain sensetive info</p>
            <p> ${process.env.CLIENT_URL}</p>
                `,
    };

    sgMail
      .send(emailData)
      .then((sent) => {
        return res.json({
          message: `Email has been Sent to ${email}`,
        });
      })
      .catch((err) => {
        return res.status(400).json({
          error: errorHandler(err),
        });
      });
  }
};
