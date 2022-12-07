const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
  userName: {
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
  number: {
    type: Number,
    default: '7845960132'
  },
  position: {
    type: String,
    default: 'Software Developer'
  },
  manager: {
    type: String,
    default: 'Jay Dalal'
  },
  token: {
    type: String,
  },
});

module.exports = mongoose.model("user", registerSchema);
