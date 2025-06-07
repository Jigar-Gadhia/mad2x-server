const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  doctorName: String,
  specialityName: String,
  hospital: String,
  about: String,
  patients: Number,
  experience: Number,
  reviews: Number
}, { collection: "doc_list" }); // Force collection name

module.exports = mongoose.model("Doctor", doctorSchema);
