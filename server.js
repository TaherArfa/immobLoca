console.clear();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

const dbConnect = require("./config/connectDB");

const bodyparser = require("body-parser");

dbConnect();

// config .env to ./config/config.env
require("dotenv").config({
  path: "./config/.env",
});
// middleware routing
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(
    // Cors its allow to deal with react for localhost at port 3000 without anyProbleme
    cors({
      origin: process.env.CLIENT_URL,
    })
  );

  // HTTP request logger middleware for node.js. ... Create a new morgan logger middleware function using the given format and options .
  app.use(morgan("dev"));
  // Morgan give information about each request
}

// Load all routes
const authRouter = require("./routes/auth.route");

// use Routes.
app.use("/api/", authRouter);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Page Not Found",
  });
});

const PORT = process.env.PORT;
app.listen(PORT, (err) =>
  err ? console.error(err) : console.log(`server is runnig   ${PORT}`)
);
