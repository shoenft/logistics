const mongoose = require("mongoose");

const TransportservicelevelcodeScheema = mongoose.Schema({
  codeListVersion: {
    type: String,
    required: false
  },
  createdAt:{
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Transportservicelevelcodes", TransportservicelevelcodeScheema);