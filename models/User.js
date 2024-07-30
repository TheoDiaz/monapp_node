const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: { type: String, unique: true },
    password: String,
    date_ajout: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);