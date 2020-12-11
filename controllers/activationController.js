const jwt = require("jsonwebtoken");
const { errorHandler } = require("../helpers/dbErrorHandling");
const User = require("../models/auth.model");

exports.activationController = (req, res) => {
  const { token } = req.body;

  if (token) {
    // verify if token is not expired
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
      if (err) {
        console.log("Activation error");
        return res.status(401).json({
          errors: "Expired link. Signup again",
        });
      } else {
        // decode the token
        const { name, email, password } = jwt.decode(token);

        console.log(email);
        const user = new User({
          name,
          email,
          password,
        });

        // save user
        user.save((err, user) => {
          if (err) {
            console.log("Save error", errorHandler(err));
            return res.status(401).json({
              errors: errorHandler(err),
            });
          } else {
            return res.json({
              success: true,
              message: "Signup success",
              user,
            });
          }
        });
      }
    });
  } else {
    return res.json({
      message: "error happening please try again",
    });
  }
};

// exports.activationController = (req, res) => {
//   const { token } = req.body;
//   if (token) {
//     // verify the token is valid or not or expired
//     jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
//       if (err) {
//         return res.status(401).json({
//           error: "Expired ToKen. signUp again",
//         });
//       } else {
//         // if valid save to database
//         //get name emal password from token
//         const { name, email, password } = jwt.decode(token);
//         const user = new User({
//           name,
//           email,
//           password,
//         });
//         user.save((err, user) => {
//           if (err) {
//             return res.status(401).json({
//               error: errorHandler(err),
//             });
//           } else {
//             return res.json({
//               success: true,
//               message: "SignUp Success",
//               user,
//             });
//           }
//         });
//       }
//     });
//   }
// };
