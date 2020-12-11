"use strict";

/*
    Get Unique error field name
*/

const uniqueMessage = (error) => {
  let output;
  try {
    let filedName = error.message.split(".$")[1];
    field = filed.split("dub key")[0];
    filed = field.substring(0, field.lastIndexOf("_"));
    req.flash("errors", [
      {
        message: "An Account with this" + filed + "already exists",
      },
    ]);
    output =
      filedName.charAt(0).toUpperCase() + filedName.slice(1) + "Already exists";
  } catch (err) {
    output = "already exists";
  }
  return output;
};

/*
Get the error message from error object
*/

exports.errorHandler = (error) => {
  let message = "";
  if (error.code) {
    switch (error.code) {
      case 11000:
      case 11001:
        message = uniqueMessage(error);
        break;
      default:
        message = `Something went Wrong ${error}`;
    }
  } else {
    for (let errorName in error.errorors) {
      if (error.errorors[errorName].message) {
        message = error.errorors[errorName].message;
      }
    }
  }
  return message;
};
