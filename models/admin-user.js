const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  fullName: {
    type: String,
    Required: "Please enter the full name",
  },
  email: {
    type: String,
    Required: "enter the valid email Id ",
  },
  password: {
    type: String,
    required: "Password is required",
  },
  token: {
    type: String,
  },
});

module.exports = mongoose.model("Admin", adminSchema);
