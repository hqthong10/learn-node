const mongoose = require("mongoose");

const W100Schema = new mongoose.Schema({
    PW100: Number,
    WV101: String,
    WV102: String
  });

  module.exports = mongoose.model("W100", W100Schema);