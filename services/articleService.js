const Article = require('../models/Article');

class ArticleService {
    async getAllArticles() {
        return await Article.find();
    }

    async getArticleById(id) {
        return await Article.findById(id);
    }

    async createArticle(articleData) {
        const newArticle = new Article(articleData);
        return await newArticle.save();
    }

    async updateArticle(id, updateData) {
        return await Article.findByIdAndUpdate(id, updateData, { new: true });
    }

    async deleteArticle(id) {
        return await Article.findByIdAndDelete(id);
    }

    async getArticleByCode(codeArticle) {
        return await Article.findOne({ codeArticle });
    }

    async updateStock(id, quantity) {
        const article = await this.getArticleById(id);
        if (!article) {
            throw new Error('Article not found');
        }
        article.quantity += quantity;
        return await article.save();
    }
}

module.exports = new ArticleService();