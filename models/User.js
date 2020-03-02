const mongoose = require("mongoose");

const UsercSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    reuired: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = mongoose.model("user", UsercSchema);
