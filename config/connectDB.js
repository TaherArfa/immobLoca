const mongoose = require("mongoose");
require("dotenv").config({
  path: "./config/.env",
});

const connectDB = async () => {
  try {
    let result = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("data base connected");
  } catch (error) {
    console.log(`can not connect to database ${error}`);
  }
};
module.exports = connectDB;

//
