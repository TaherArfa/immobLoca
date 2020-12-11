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

exports.forgetController = (req, res) => {
  console.log("forgetcontroller");
  const { email } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    User.findOne(
      {
        email,
      },
      (err, user) => {
        if (err || !user) {
          return res.status(400).json({
            error: "User with that email does not exist",
          });
        }

        const token = jwt.sign(
          {
            _id: user._id,
          },
          process.env.JWT_RESET_PASSWORD,
          {
            expiresIn: "10m",
          }
        );

        const emailData = {
          from: process.env.EMAIL_FROM,
          to: email,
          subject: `Password Reset link`,
          html: `
                    <h1>Please use the following link to reset your password</h1>
                    <p>${process.env.CLIENT_URL}/users/passwords/reset/${token}</p>
                    <hr />
                    <p>This email may contain sensetive information</p>
                    <p>${process.env.CLIENT_URL}</p>
                `,
        };

        return user.updateOne(
          {
            resetPasswordLink: token,
          },
          (err, success) => {
            if (err) {
              console.log("RESET PASSWORD LINK ERROR", err);
              return res.status(400).json({
                error:
                  "Database connection error on user password forgot request",
              });
            } else {
              sgMail
                .send(emailData)
                .then((sent) => {
                  // console.log('SIGNUP EMAIL SENT', sent)
                  return res.json({
                    message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
                  });
                })
                .catch((err) => {
                  // console.log('SIGNUP EMAIL SENT ERROR', err)
                  return res.json({
                    message: err.message,
                  });
                });
            }
          }
        );
      }
    );
  }
};

// exports.forgetController = (req, res) => {
//   const { email } = req.body;
//   const errors = validationResult(req);

//   // validation to req, body we will create custom validation in seconds
//   if (!errors.isEmpty()) {
//     const firstError = errors.array().map((error) => error.msg)[0];
//     return res.status(422).json({
//       errors: firstError,
//     });
//   } else {
//     // find if yser exists
//     User.findOne(
//       {
//         email,
//       },
//       (err, user) => {
//         if (err || !user) {
//           return res.status(400).json({
//             error: "User with that email does not exist",
//           });
//         }
//         // if exists
//         // generate token for user wwith this id valid for on 10min
//         const token = jwt.sign(
//           {
//             _id: user._id,
//           },
//           process.env.JWT_RESET_PASSWORD,
//           {
//             expiresIn: "10m",
//           }
//         );

//         const emailData = {
//           from: process.env.EMAIL_FROM,
//           to: email,
//           subject: `Password Reset link`,
//           html: `
//                       <h1>Please use the following link to reset your password</h1>
//                       <p>${process.env.CLIENT_URL}/users/password/reset/${token}</p>
//                       <hr />
//                       <p>This email may contain sensetive information</p>
//                       <p>${process.env.CLIENT_URL}</p>
//                   `,
//         };

//         return user.updateOne(
//           {
//             resetPasswordLink: token,
//           },
//           (err, success) => {
//             if (err) {
//               console.log("RESET PASSWORD LINK ERROR", err);
//               return res.status(400).json({
//                 error: errorHandler(err),
//                 //   "Database connection error on user password forgot request",
//               });
//             } else {
//               sgMail
//                 .send(emailData)
//                 .then((sent) => {
//                   // console.log('SIGNUP EMAIL SENT', sent)
//                   return res.json({
//                     message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
//                   });
//                 })
//                 .catch((err) => {
//                   // console.log('SIGNUP EMAIL SENT ERROR', err)
//                   return res.json({
//                     message: err.message,
//                   });
//                 });
//             }
//           }
//         );
//       }
//     );
//   }
// };
