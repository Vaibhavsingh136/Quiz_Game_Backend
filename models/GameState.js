// models/GameState.js
const mongoose = require('mongoose');

const gameStateSchema = new mongoose.Schema({
  currentRound: { type: Number, default: 1 }, // Current round number
  roundStatus: { type: String, enum: ['waiting', 'active', 'completed'], default: 'waiting' }, // Round state
});

module.exports = mongoose.model('GameState', gameStateSchema);