const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    name: String,
    codeArticle: String,
    description: String,
    image: String,
    price: Number,
    quantity: Number
});

module.exports = mongoose.model('Article', articleSchema);