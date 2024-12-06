// models/Question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: { type: [String], required: true },
  correctOption: { type: String, required: true },
  round: { type: Number, required: true }, // New field for round number
});

module.exports = mongoose.model('Question', questionSchema);
