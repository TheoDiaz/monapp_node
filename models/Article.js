const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    codeArticle: { type: String, required: true, unique: true },
    description: String,
    image: String,
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    releaseDate: Date,
    platforms: [String],
    genres: [String]
});

module.exports = mongoose.model('Article', articleSchema);