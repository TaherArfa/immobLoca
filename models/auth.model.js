const mongoose = require("mongoose");
const crypto = require("crypto");
// user schema
const userScheama = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    salt: String,
    role: {
      type: String,
      default: "subscriber",
    },
    resetPasswordLink: {
      data: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// virtual
userScheama
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// methods
userScheama.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },

  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

module.exports = mongoose.model("User", userScheama);

// const mongoose = require("mongoose");
// const crypto = require("crypto");

// const Schema = mongoose.Schema;

// const UserSchema = new Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       trim: true,
//       unique: true,
//       lowercase: true,
//     },
//     hashed_password: {
//       type: String,
//       trim: true,
//       require: true,
//     },
//     salt: String,
//     role: {
//       type: String,
//       default: "normal",
//       // two more type 'normal, admin
//     },
//     resetPasswordLink: {
//       data: String,
//       default: "",
//     },
//   },
//   { timestamps: true }
// );

// //virtual password
// UserSchema.virtual("password")
//   .set(function (password) {
//     //set password must be with nrml function not arrow function
//     this.password = password;
//     this.salt = this.makeSalt();
//     this.hashed_password = this.encryptPassword(password);
//   })
//   .get(function () {
//     return this.password;
//   });

// UserSchema.methods = {
//   //Generate Salt
//   makeSalt: function () {
//     return Math.round(new Date().valueOf() * Math.random()) + "";
//   },
//   // EncyPt Password
//   encryptPassword: function (password) {
//     if (!password) return "";
//     try {
//       return crypto
//         .createHmac("sha1", this.salt)
//         .update(password)
//         .digest("hex");
//     } catch (error) {
//       return "error crypto", error;
//     }
//   },

//   // compare password between plain get from user and hashed
//   authenticate: function (plainPassword) {
//     return this.encryptPassword(plainPassword) === this.hashed_password;
//   },
// };

// module.exports = User = mongoose.model("User", UserSchema);
